mewPipeApp.controller('UserProfileCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService',
	function($rootScope, $http, $scope, $route, $location, $callService){

		$scope.showUser = function(){
			$callService.requestGet('user_readOne', null, $rootScope.getToken(), function (success, data) {
				if(success){
					$scope.user = data;
				}else {
					$rootScope.showNotif(data.error, 'error');
				}
			});
		};
		$scope.showUser();

		$scope.editUser = function(){
			var data = {

			};
			$callService.requestPost('user_update', data, function (success, data) {
				if(resp){
					console.log(resp);
				}else {
					$rootScope.showNotif(resp.error, 'error');
				}
			});
		};

	}]);