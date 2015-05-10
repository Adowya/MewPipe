mewPipeApp.controller('VideoUpdateCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce',
	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce) {


		var video_id = $routeParams.param

		$scope.video = $rootScope.app.video.play(video_id);

		$scope.videoRead = function () {
			$callService.requestGet('video_read', video_id, null, function (success, data) {
				if (success) {
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
				} else {
					$rootScope.app.showNotif(data, 'notice');
				}
			});
		};
		$scope.videoRead();

		$scope.submitUpdate = function () {
			$callService.requestPost('video_update', video_id, $rootScope.app.getToken(), function (success, data) {
				if (success) {
					console.log(data);
					$location.path('/');
				} else {
					$rootScope.app.showNotif(data, 'error');
				}
			});
		}


	}]);