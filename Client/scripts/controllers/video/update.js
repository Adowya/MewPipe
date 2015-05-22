/**
 * Video update
 */
mewPipeApp.controller('VideoUpdateCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$videoService',
	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $videoService) {

		$callService.request(null, 'video_read', $routeParams.param, null, null, function (data) {
			$scope.video = $videoService(data, 'play');
			$scope.user = data._user;
		});

		$scope.submitUpdate = function () {
			$callService.request('PUT', 'video_update', $routeParams.param, $scope.video, true, function (data) {
				$location.path('/video/show/'+$routeParams.param);
			});
		}
		
	}]);