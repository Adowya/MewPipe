mewPipeApp.controller('VideoUserCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce', 
	function($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce){

		$scope.videos = [];
		$scope.allVideo = function() {
			$callService.requestGet('video_user', appStorage.get("user")._id, $rootScope.getToken(), function (success, data) { 
				if(success){
					for(var i in data) {
						$scope.videos.push(data[i]);
						$scope.videos[i].image = getApiAddr() + apiUrl.route['video_image'] +"/"+ data[i]._id;
						var dateString = moment(data[i].created).format("MM/DD/YYYY");
						$scope.videos[i].created = dateString;
						$scope.videos[i].size = bytesToSize(data[i].size);
					}
				}else {
					$rootScope.showNotif(data, 'notice');
				}
			});
		}
		$scope.allVideo();

	}]);
