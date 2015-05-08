'use strict';
var MewPipeModule = angular.module('callModule', []);
MewPipeModule.factory('$callService', [
	'$rootScope', '$http',
	function ($rootScope, $http) {

		var $callService = {

			requestGet: function (model, param, token, callback) {
				if(param != null){
					var url = getApiAddr() + api.route[model] +"/"+ param;
				}else {
					var url = getApiAddr() + api.route[model];
				}
				// console.log('Request GET at ', url);
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
							// console.log(res);
							if(res.error){
								callback(res.success, res.error);
							}else {
								callback(res.success, res.data);
							}
						}
					})
				.error(function (err, code) {
					$rootScope.httpError(code, err);
				});
			},

			requestPost: function (model, data, token, callback) {
				var url = getApiAddr() + api.route[model];
				console.log('Request POST at ', url);
				$http({
					url: url,
					method: "POST",
					headers: {
						'x-access-token': token
							// 'Authorization': 'Basic ' + login_base64
						},
						data: {
							data: data
						}
					})
				.success(function (res) {
					if (typeof callback === "function") {
						// console.log(res);
						callback(res);
					}
				})
				.error(function (err, code) {
					$rootScope.httpError(code, err);
				});
			},

			logout: function (token, callback) {
				var url = appConfig.api.prefix + appConfig.api.addr+":"+appConfig.api.port + api.route['logout'];
				$http({
					url: url,
					method: "GET",
					headers: {
						'x-access-token':token
					},
					data: {
					}
				})
				.success(function (res) {
					if (typeof callback === "function") {
							console.log(res);
							if(res.error){
								callback(res.success, res.error);
							}else {
								callback(res.success, res.data);
							}
						}
					})
				.error(function (err, code) {
					callback(true, {});
					// $rootScope.httpError(code, err);
				});
			},

		};

		return $callService;
	}]);  