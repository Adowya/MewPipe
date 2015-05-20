mewPipeApp.controller('UserUpdateCtrl', ['$rootScope', '$http', '$scope', '$route', '$routeParams', '$location', '$callService',
	function ($rootScope, $http, $scope, $route, $routeParams, $location, $callService) {

		$callService.request(null, 'user_readOne', null, null, true, function (data) {
			$scope.user = data;
		});

		$scope.submitUpdate = function() {
			$callService.request('POST', 'user_update', null, $scope.user, null, function (data) {
				console.log(data);
			});
		};

	}]);