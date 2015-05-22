'use strict';
var MewPipeModule = angular.module('ServiceModule', []);
MewPipeModule.factory('$authService', [
	'$rootScope', '$http', '$location', '$callService', '$q',
	function ($rootScope, $http, $location, $callService, $q) {

		var $authService = {
			userId: null,
			isLoggedIn: isLoggedIn,
			getUserName: getUserName,
			logout: logout
		};

		return $authService;

		function isLoggedIn(redirectToLogin) {
			return $callService.request(null, 'auth_user', null, null, true, function (res) {
				$authService.userId = res._user._id;
				if (res._user._id === null) {
					if (redirectToLogin !== false) {
						return $location.path("/");
					}
					return false;
				}
				return {
					'userId': $authService.userId,
				};
			});
		}

		function getUserName() {
			if ($authService.userName === undefined) {
				return $authService.isLoggedIn();
			} else {
				return $q.when({
					'userId': $authService.userId
				});
			}
		}

		function logout() {
			if ($rootScope.app.getToken()) {
				$callService.request(null, 'auth_logout', null, null, true, function (data) {
					if (data) {
						config.storage.delete('token');
						$location.path('/');
					} else {
						$rootScope.app.showNotif(data, 'notice');
					}
				});
				// TODO error callback
				//$cookies.token = undefined;
				$location.path('/');
			} else {
				$rootScope.app.showNotif('You don\'t allow.', 'error');
			}
		}

	}]);  