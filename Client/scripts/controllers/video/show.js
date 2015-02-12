
mewPipeApp.controller('VideoShowCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce', 
	function($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce){

		var video_id = null;
		if($routeParams.param != null || $routeParams.param == 'undefined'){
			video_id = $routeParams.param
		}
		//else {
		// 	if($rootScope.initParam._id){
		// 		video_id = $rootScope.initParam._id
		// 	}
		// }
		// console.log(video_id);

		if(video_id != null){
			$scope.video = {
				name : "",
				description: "",
				created : "",
				size: "",
				views: 0,
				sources: [
				{
					src: $sce.trustAsResourceUrl("http://127.0.0.1:8080/api/videos/download/"+video_id), 
					type: "video/mp4"
				}
				],
				plugins: {
					poster: ""
				},
				theme: "bower_components/videogular-themes-default/videogular.css"
			};

			$scope.videoRead = function(){
				$callService.requestGet('video_read', video_id, null, function (success, data) {
					if(success){
						$scope.video.name = data.name;
						$scope.video.description = data.description;
						var dateString = moment(data.created).format("MM/DD/YYYY");
						$scope.video.created = dateString;
						$scope.video.size = bytesToSize(data.size);
						$scope.video.sources = data.size;
						$scope.user = data._user;
					}else {
						$rootScope.showNotif(data, 'notice');
					}
				});
			};
			$scope.videoRead();

		}

	}]);