
mewPipeApp.controller('VideoShowCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', 
	function($rootScope, $http, $scope, $route, $location, $callService, $routeParams){

		var video_id = $routeParams.param

		$scope.videoRead = function(){
			$callService.requestGet('video_read', video_id, function (success, data) {
				if(success){
					console.log(data);
				}else {
					$scope.showNotif(data.error);
				}
			});
		};
		$scope.videoRead();

	}]);