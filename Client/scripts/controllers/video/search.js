/**
 * Video search
 */
 mewPipeApp.controller('VideoSearchCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$videoService',
 	function ($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $videoService) {

 		$scope.canLoad = true;
 		var maxItems = 5;
 		$scope.videos = [];
 		$scope.param = {
 			q: atob($routeParams.param),
 			page: 0
 		};

 		if ($routeParams.param) {
 			$callService.request('POST', 'video_search', null, $scope.param, null).then(function (data) {
 				if (data.length > 0) {
 					data.forEach(function (video) {
 						$scope.videos.push($videoService(video, null));
 					});
 					if (data.length <= maxItems) $scope.canLoad = false;
 				} else {
 					$scope.videos = [];
 					$scope.canLoad = false;
 				}
 			});
 		}

 		$scope.loadMore = function () {
 			$scope.allowLoadMore = false;
 			$callService.request('POST', 'video_search', null, $scope.param, null).then(function (data) {
 				if(data.length > 0){
 					for(var i=0; i<data.length;i++){
 						$scope.tempVideos.push(data[i]);
 					}
 					$scope.pronos = $scope.tempVideos;
 					$scope.param.page++;
 					$scope.allowLoadMore = true;
 				}else{
 					$scope.allowLoadMore = false;
 				}
 			});
 		};

 	}
 	]);