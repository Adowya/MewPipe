/** 
 * User update
 */
/**
 * User update
 */
mewPipeApp.controller('UserUpdateCtrl', ['$rootScope', '$http', '$scope', '$route', '$routeParams', '$location', '$callService',
	function ($rootScope, $http, $scope, $route, $routeParams, $location, $callService) {

		$callService.request(null, 'user_readOne', null, null, true).then(function (data) {
			$scope.user = data;
			$scope.user.birthdate = moment(data.created).format("MMMM Do YYYY");
			$scope.user.created = moment(data.created).format("MMMM Do YYYY, h:mm");
		});

		$scope.submitUpdate = function () {
			$callService.request('PUT', 'user_update', null, $scope.user, true).then(function (data) {
				$location.path('/user/profile');
			});

			if ($scope.user.authProvider == 'local') {
				var data = {
					oldPass: $scope.user.oldpassword,
					newPass: $scope.user.newpassword
				}
				$callService.request('PUT', 'user_changePassword', null, data, true).then(function (data) { });
			}
		};

		$callService.request(null, 'user_stat', null, null, true).then(function (data) {
			$scope.user.stat = data;
		});

	}]);