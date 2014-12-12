mewPipeApp.controller('ProfileCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService',
	function($rootScope, $http, $scope, $route, $location, $callService){

		$scope.showUser = function(){
			$callService.requestGet('login', function (success, data) {
				if(success){
					console.log(data);
				}else {
					$scope.showNotif(data.error);
				}
			});
		};
		$scope.showUser();

		$scope.editUser = function(){
			var data = {

			};
			$callService.requestPost('login', data, function (resp) {
				if(resp){
					console.log(resp);
				}else {
					$scope.showNotif(resp.error);
				}
			});
		};

	}]);