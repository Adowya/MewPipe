mewPipeApp.controller('UserProfileCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService',
	function($rootScope, $http, $scope, $route, $location, $callService){

		$scope.showUser = function(){
			$callService.requestGet('login', null, null, function (success, data) {
				if(success){
					console.log(data);
				}else {
					$rootScope.showNotif(data.error, 'error');
				}
			});
		};
		// $scope.showUser();

		$scope.editUser = function(){
			var data = {

			};
			$callService.requestPost('login', data, function (resp) {
				if(resp){
					console.log(resp);
				}else {
					$rootScope.showNotif(resp.error, 'error');
				}
			});
		};

	}]);