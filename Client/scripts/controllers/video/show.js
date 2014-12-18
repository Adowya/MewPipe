
mewPipeApp.controller('VideoShowCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce', 
	function($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce){

		var video_id = $routeParams.param

		$scope.video = {
			name : "",
			description: "",
			created : "",
			size: "",
			sources: [
			{
				src: $sce.trustAsResourceUrl("http://127.0.0.1:8080/api/video/download/"+video_id), 
				type: "video/mp4"
			}
			],
			plugins: {
				poster: ""
			},
			theme: "bower_components/videogular-themes-default/videogular.css"
		};

		$scope.videoRead = function(){
			$callService.requestGet('video_read', video_id, function (success, data) {
				if(success){
					$scope.video.name = data.name;
					$scope.video.description = data.description;
					$scope.video.created = data.created;
					$scope.video.size = data.size;
					$scope.video.sources = data.size;
					$scope.user = data._user;
				}else {
					$scope.showNotif(data);
				}
			});
		};
		$scope.videoRead();


	}]);