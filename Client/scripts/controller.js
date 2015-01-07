mewPipeApp.controller('MainCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$sce',
	function($rootScope, $http, $scope, $route, $location, $callService, $sce) {


		$scope.config = {
			sources: [
			{src: $sce.trustAsResourceUrl("http://127.0.0.1:8080/api/video/download/54931e0dd46f920000f2e3ae"), type: "video/mp4"}
			],
			theme: "bower_components/videogular-themes-default/videogular.css",
			plugins: {
				poster: ""
			}
		};

		setTimeout( function() {
			$rootScope.showNotif('This is a test', 'error');
		}, 2000 );

	}]);