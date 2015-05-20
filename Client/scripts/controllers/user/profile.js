/**
 * User profile
 */
mewPipeApp.controller('UserProfileCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService',
	function ($rootScope, $http, $scope, $route, $location, $callService) {

		$callService.request(null, 'user_readOne', null, null, true, function (data) {
			$scope.user = data;
		});

		$scope.submitDelete = function () {
			$callService.request("DELETE", "user_delete", null, null, true, function (data) {
				console.log(data);
				$location.path('/user/profile');
			});
		};
	}]);