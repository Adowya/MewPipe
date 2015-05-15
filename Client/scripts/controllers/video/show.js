
mewPipeApp.controller('VideoShowCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce',
	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce) {

		var video_id = null;
		if ($routeParams.param != null || $routeParams.param == 'undefined') {
			video_id = $routeParams.param
		}

		if (video_id != null) {
			$scope.video = $rootScope.app.video.download(video_id);

			$callService.request(null, 'video_read', video_id, null, null, function (data) {
				$scope.video.name = data.name;
				$scope.video.description = data.description;
				var dateString = moment(data.created).format("MM/DD/YYYY");
				$scope.video.created = dateString;
				$scope.video.size = bytesToSize(data.size);
				$scope.user = data._user;
			});

		}

	}]);