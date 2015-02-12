
mewPipeApp.controller('VideoUserCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$routeParams', '$sce', 
	function($rootScope, $http, $scope, $route, $location, $callService, $routeParams, $sce){

		$scope.allVideo = function() {
			$callService.requestGet('video_user', appStorage.get("user")._id, $rootScope.getToken(), function (success, data) { 
				if(success){
					console.log(data);
				}else {
					$rootScope.showNotif(data, 'notice');
				}
			});
		}

	}]);
