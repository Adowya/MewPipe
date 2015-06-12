mewPipeApp.controller('MainCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$videoService', '$cookies',
	function ($rootScope, $http, $scope, $route, $location, $callService, $videoService, $cookies) {

		$scope.relatedVideos = [];
		$callService.request(null, 'video_last', 6, null, null).then(function (data) {
			for (var i in data) {
				$scope.relatedVideos.push($videoService(data[i], null));
				$scope.user = data._user;
			}
		});

		if($rootScope.app.getToken()){
			$scope.suggestVideos = [];
			$callService.request(null, 'user_suggested', null, null, true).then(function (data) {
				for (var i in data) {
					$scope.suggestVideos.push($videoService(data[i], null));
					$scope.user = data._user;
				}
			});
		}

		setTimeout(function () {
			new grid3D(document.getElementById('relatedVideo'));
		}, 200);
		setTimeout(function () {
			new grid3D(document.getElementById('suggestedVideo'));
		}, 200);
		
		
		$scope.videoModal = {};
		$scope.videoModal.show = function(video) {
			if(video) {
				angular.extend($scope.videoModal, $videoService(video, 'play'));
				console.log($scope.videoModal);
			}else {
				$scope.videoModal = {};
			}
		};
	}]);

mewPipeApp.controller('AuthCtrl', ['$rootScope', '$scope', '$route', '$routeParams', '$location',
	function ($rootScope, $scope, $route, $routeParams, $location) {

		if ($routeParams.param) {
			localStorage.setItem('token', $routeParams.param);
			$rootScope.isConnect = true;
			$location.path("/");
		}

	}]);
