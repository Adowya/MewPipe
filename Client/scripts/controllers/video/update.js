mewPipeApp.controller('VideoUpdateCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce', 
	function($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce){


		var video_id = $routeParams.param

		$scope.video = {
			name : "",
			description: "",
			created : "",
			size: "",
			views: "",
			rights: "",
			sources: [
			{
				src: $sce.trustAsResourceUrl("http://127.0.0.1:8080/api/videos/play/"+video_id), 
				type: "video/mp4"
			}
			],
			plugins: {
				poster: ""
			},
			theme: "lib/videogular-themes-default/videogular.css"
		};

		$scope.videoRead = function(){
			$callService.requestGet('video_read', video_id, null, function (success, data) {
				if(success){
					$scope.video.name = data.name;
					$scope.video.description = data.description;
					var dateString = moment(data.created).format("Do MMMM YYYY");
					$scope.video.created = dateString;
					$scope.video.size = bytesToSize(data.size);
					$scope.video.sources = data.size;
					$scope.video.views = data.views;
					$scope.video.rights = data.rights;
					$scope.video.sources.type = "video/"+data.ext;
					$scope.user = data._user;
				}else {
					$rootScope.showNotif(data, 'notice');
				}
			});
		};
		$scope.videoRead();


	}]);