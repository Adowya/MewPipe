mewPipeApp.controller('MainCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$videoService', '$cookies',
	function ($rootScope, $http, $scope, $route, $location, $callService, $videoService, $cookies) {

		$scope.relatedVideos = [];
		$callService.request(null, 'video_read', null, null, null, function (data) {
			for (var i in data) {
				$scope.relatedVideos.push($videoService(data[i], 'download'));
				$scope.user = data._user;
			}
		});

		$scope.suggestVideos = [];
		$callService.request(null, 'video_last', 6, null, null, function (data) {
			for (var i in data) {
				$scope.suggestVideos.push($videoService(data[i], 'download'));
				$scope.user = data._user;
			}
		});

		setTimeout(function () {
			new grid3D(document.getElementById('relatedVideo'));
		}, 200);
		setTimeout(function () {
			new grid3D(document.getElementById('suggestedVideo'));
		}, 200);

	}]);

mewPipeApp.controller('AuthCtrl', ['$rootScope', '$http', '$scope', '$route', '$routeParams', '$location', '$callService', '$sce', '$cookies',
	function ($rootScope, $http, $scope, $route, $routeParams, $location, $callService, $sce, $cookies) {

		if ($routeParams.param) {
			localStorage.setItem('token', $routeParams.param);
			$rootScope.isConnect = true;
			$location.path("/");
		}

	}]);
