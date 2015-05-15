mewPipeApp.controller('VideoUpdateCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce',
	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce) {


		$scope.video = $rootScope.app.video.play($routeParams.param);
		
		$callService.request(null, 'video_read', $routeParams.param, null, null, function (data) {
			$scope.video.name = data.name;
			$scope.video.description = data.description;
			var dateString = moment(data.created).format("Do MMMM YYYY");
			$scope.video.created = dateString;
			$scope.video.size = bytesToSize(data.size);
			$scope.video.sources = data.size;
			$scope.video.views = data.views;
			$scope.video.rights = data.rights;
			$scope.video.sources.type = "video/" + data.ext;
			$scope.user = data._user;
		});

		$scope.submitUpdate = function () {
			$callService.request('PUT', 'video_update', $routeParams.param, $scope.video, true, function (data) {
				$location.path('/video/show/'+$routeParams.param);
			});
		}


	}]);