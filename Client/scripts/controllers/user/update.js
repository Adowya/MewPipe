/** 
 * User update
 */
mewPipeApp.controller('UserUpdateCtrl', ['$rootScope', '$http', '$scope', '$route', '$routeParams', '$location', '$callService',
	function ($rootScope, $http, $scope, $route, $routeParams, $location, $callService) {

		$callService.request(null, 'user_readOne', null, null, true).then(function (data) {
			$scope.user = data;
		});

		$scope.submitUpdate = function() {
			$callService.request('POST', 'user_update', null, $scope.user, null).then(function (data) {
				console.log(data);
			});
		};

	}]);