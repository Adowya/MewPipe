mewPipeApp.controller('VideoSearchCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$videoService',
	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $videoService) {

		$scope.videos = [];
		if ($routeParams.param) {
			$scope.param = {
				q: atob($routeParams.param)
			};
			$callService.request('POST', 'video_search', null, $scope.param, null).then(function (data) {
				if (data.length > 0) {
					for (var i in data) {
						$scope.videos.push($videoService(data[i], null));
					}
				} else {
					$scope.videos = [];
				}
			});
		}

	}]);
