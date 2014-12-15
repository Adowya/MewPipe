mewPipeApp.controller('MainCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$sce',
	function($rootScope, $http, $scope, $route, $location, $callService, $sce) {

		console.log('MainCtrl start');
		this.config = {
			sources: [
			{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
			{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
			{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
			],
			tracks: [
			{
				src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
				kind: "subtitles",
				srclang: "en",
				label: "English",
				default: ""
			}
			],
			theme: "bower_components/videogular-themes-default/videogular.css",
			plugins: {
				poster: "http://www.videogular.com/assets/images/videogular.png"
			}
		};

	}]);