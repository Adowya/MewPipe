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
			console.log($scope.user);
			$callService.request('PUT', 'user_update', null, $scope.user, true).then(function (data) {
				$location.path('/user/profile');
			});
		};
		
		$callService.request(null, 'user_stat', null, null, true).then(function (data) {
			$scope.user.stat = data;
		});

	}]);