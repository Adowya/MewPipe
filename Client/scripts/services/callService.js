'use strict';
var MewPipeModule = angular.module('callModule', []);
MewPipeModule.factory('$callService', [
	'$rootScope', '$http', '$location', 'Upload',
	function ($rootScope, $http, $location, Upload) {
		
		/**
		 * Catch request error 
		 * @Error message
		 * @Code code http error
		 */
		var httpError = function (err, code) {
			if (401 == code) {
				$rootScope.logOut();
				console.error('Error 401');
				$location.path("/");
			} else if (404 == code) {
				$location.path("/");
				console.error('Error 404');
			} else if (500 == code || 503 == code) {
				$location.path("/");
				console.error('Error 500 or 503');
			} else {
				console.error('Error inconue', err, code);
			}
		};

		var $callService = {
			
			/**
			 * Request Factory
			 * @method {string} HTTP method GET, POST, PUT, DELETE
			 * @model {string} API route
			 * @param {string} param for url (optional)
			 * @data {object} object json for request body (optional)
			 * @token {bool} header token (optional)
			 * @callback {function} return object data request or true
			 */
			request: function (method, model, param, data, token, callback) {
				var url = config.getApiAddr() + config.api.route[model];
				if (param) { url = url + "/" + param; }
				if (!method) { method = "GET"; }
				if (config.debug) { console.log('%cRequest ' + method + ' ' + model + ' at ' + config.api.route[model], 'color: purple'); }

				$http({
					url: url,
					method: method,
					headers: {
						'x-access-token': (token) ? $rootScope.app.getToken() : null
						// 'Authorization': 'Basic ' + login_base64
					},
					data: data
				})
					.success(function (res) {
					if (typeof callback === "function") {
						if (res.success) {
							(res.data) ? callback(res.data) : callback(true);
						} else {
							$rootScope.app.showNotif(res.error, 'error');
						}
					}
				})
					.error(function (err, code) {
					httpError(err, code);
				});
			},

			upload: function (data, callback) {
				var url = config.getApiAddr() + config.api.route['video_upload'];
				Upload.upload({
					url: url,
					method: "POST",
					headers: {
						'x-access-token': $rootScope.app.getToken()
					},
					data: {
						"name": data.name,
						"description": data.description,
						"rights": data.rights
					},
					file: data,
				}).progress(function (evt) {
					$rootScope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
				}).success(function (res, status, headers, config) {
					if (res.success) {
						callback(res.data);
					} else {
						if (config.debug) { console.log('error', res); }
						if (res.error.errors) {
							for (var i in res.error.errors) {
								if (res.error.errors.hasOwnProperty(i)) {
									$rootScope.app.showNotif(res.error.errors[i].message, 'error');
								}
							}
						} else {
							$rootScope.app.showNotif(res.error, 'error');
						}
					}
				})
					.error(function (err, code) {
					httpError(err, code);
				});
			},

			logout: function (token, callback) {
				var url = config.api.prefix + config.api.addr + ":" + config.api.port + config.api.route['logout'];
				$http({
					url: url,
					method: "GET",
					headers: {
						'x-access-token': token
					},
					data: {
					}
				})
					.success(function (res) {
					if (typeof callback === "function") {
						if (config.debug) { console.log(res); }
						if (res.error) {
							callback(res.success, res.error);
						} else {
							callback(res.success, res.data);
						}
					}
				})
					.error(function (err, code) {
					callback(true, {});
					// httpError(err, code);
				});
			},

		};

		return $callService;
	}]);  