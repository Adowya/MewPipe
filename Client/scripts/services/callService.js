'use strict';
var scanModule = angular.module('callModule', []);
scanModule.factory('$callService', [
	'$rootScope',
	function ($rootScope) {

		var $callService = {

			requestGet: function (model, param, callback) {
				if(param != null){
					var url = getApiAddr() + apiUrl.route[model] +"/"+ param;
				}else {
					var url = getApiAddr() + apiUrl.route[model];
				}
				// var login_base64 = btoa(appStorage.get(login) + ':' + appStorage.get(pwd);
					console.log('Request GET at ', url);
					$http({
						url: url,
						method: "GET",
						headers: {
        				// 'Authorization': 'Basic ' + login_base64
        			},
        			data: {
        			}
        		})
					.success(function (res) {
						if (typeof callback === "function") {
							callback(res.success, res.data);
						}
					})
					.error(function (err, code) {
						$rootScope.httpError(code, err);
					});
				},

				requestPost: function (model, data, callback) {
					var url = getApiAddr() + apiUrl.route[model];
					console.log('Request POST at ', url);
					$http({
						url: url,
						method: "POST",
						headers: {
							// 'Authorization': 'Basic ' + login_base64
						},
						data: {
							data: data
						}
					})
					.success(function (res) {
						if (typeof callback === "function") {
							callback(res);
						}
					})
					.error(function (err, code) {
						$rootScope.httpError(code, err);
					});
				},

			};

			return $callService;
		}]);  