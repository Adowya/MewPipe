/**
 * Video show
 */
mewPipeApp.controller('VideoShowCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$videoService', '$routeParams',
	function ($rootScope, $http, $scope, $route, $location, $callService, $videoService, $routeParams) {

		$scope.video = [];
		var video_id = null;
		if ($routeParams.param != null || $routeParams.param == 'undefined') {
			video_id = $routeParams.param
		}

		if (video_id != null) {
			$callService.request(null, 'video_read', video_id, null, null).then(function (data) {
				$scope.video = $videoService(data, 'play');
				$scope.user = data._user;
			});
		}

		$scope.relatedVideos = [];
		$callService.request(null, 'video_related', video_id, null, null).then(function (data) {
			for (var i in data) {
				if (i < 3) {
					$scope.relatedVideos.push($videoService(data[i], null));
				}
			}
		});


	}]);