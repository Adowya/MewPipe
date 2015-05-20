/**
 * Video user
 */
mewPipeApp.controller('VideoUserCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce',
	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce) {

		$scope.videos = [];
		$callService.request(null, 'video_user', null, null, true, function (data) {
			if (data.length > 0) {
				for (var i in data) {
					$scope.videos.push(data[i]);
					$scope.videos[i].image = config.getApiAddr() + config.api.route['video_image'] + "/" + data[i]._id;
					var dateString = moment(data[i].created).format("MM/DD/YYYY");
					$scope.videos[i].created = dateString;
					$scope.videos[i].size = bytesToSize(data[i].size);
				}
			} else {
				$scope.videos = [];
			}
		});

		$scope.submitDelete = function (id) {
			$callService.request("DELETE", 'video_delete', id, null, true, function (data) {
				if (data) {
					$route.reload();
				}
			})
		};

	}]);

/**
 * Video users
 */
mewPipeApp.controller('VideoUsersCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce',
	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce) {
		
		$scope.videos = [];
		if ($routeParams.param) {
			$callService.request(null, 'video_guest', $routeParams.param, null, null, function (data) {
				if (data.length > 0) {
					for (var i in data) {
						$scope.videos.push(data[i]);
						$scope.videos[i].image = config.getApiAddr() + config.api.route['video_image'] + "/" + data[i]._id;
						var dateString = moment(data[i].created).format("MM/DD/YYYY");
						$scope.videos[i].created = dateString;
						$scope.videos[i].size = bytesToSize(data[i].size);
					}
				} else {
					$scope.videos = [];
				}
			});
        } else {
			$location.path('/video/user');
		}
		
	}]);
