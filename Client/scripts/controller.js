mewPipeApp.controller('MainCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$sce', '$cookies',
	function ($rootScope, $http, $scope, $route, $location, $callService, $sce, $cookies) {

		$scope.relatedVideos = [];
		$callService.request(null, 'video_read', null, null, null, function (data) {
			for (var i in data) {
				$scope.relatedVideos.push(data[i]);
				$scope.relatedVideos[i].image = config.getApiAddr() + config.api.route['video_image'] + "/" + data[i]._id;
				$scope.relatedVideos[i].sources = [{
					src: $sce.trustAsResourceUrl("http://127.0.0.1:8080/api/videos/download/" + data[i]._id),
					type: "video/mp4"
				}];
				$scope.relatedVideos[i].theme = "lib/videogular-themes-default/videogular.css";
				$scope.user = data._user;
			}

		});

		$scope.suggestVideos = [];
		$callService.request(null, 'video_last', 6, null, null, function (data) {
			for (var i in data) {
				$scope.suggestVideos.push(data[i]);
				$scope.suggestVideos[i].image = config.getApiAddr() + config.api.route['video_image'] + "/" + data[i]._id;
				$scope.suggestVideos[i].sources = [{
					src: $sce.trustAsResourceUrl("http://127.0.0.1:8080/api/videos/download/" + data[i]._id),
					type: "video/mp4"
				}];
				$scope.suggestVideos[i].theme = "lib/videogular-themes-default/videogular.css";
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

		localStorage.setItem('token', $routeParams.param)
		$location.path("/");


	}]);
