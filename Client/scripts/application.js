var mewPipeApp = angular.module('mewPipeApp', [
	'ngAnimate',
	'ngResource',
	'ngCookies',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ngFileUpload',
	'xeditable',
	'callModule',
	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"com.2fdevs.videogular.plugins.overlayplay",
	"com.2fdevs.videogular.plugins.poster"
	]);

mewPipeApp.run([
	'$rootScope',
	'$http',
	'$location',
	'$route',
	'$callService',
	'$cookies',
	'$sce',
	function ($rootScope, $http, $location, $route, $callService, $cookies, $sce) {

		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			if(typeof current.$$route != "undefined"){

				if($rootScope.getToken() && $rootScope.getToken() != "undefined"){
					$rootScope.isConnect = true;
					if(localStorage.getItem("user") && localStorage.getItem("user") == "undefined"){
						$callService.requestGet('user_readOne', null, $rootScope.getToken(), function (success, data) {
							if(success){
								appStorage.set("user", data);
							}else {
								$rootScope.showNotif(data, 'notice');
							}
						});
					}
				}else {
					$rootScope.isConnect = false;
					$cookies.token = undefined;
					var user;
					appStorage.set("user", user);
				}
				

				/* ------------------------------------------- Restrict Auth ------------------------------------------- */
	           /* 
				0 = Allow-*
				1 = Allow-User
				2 = Allow-Admin
				*/
				var restrict = current.$$route.restrict;
				if(restrict == 1){
					if(!$rootScope.isConnect){
						$location.path("/");
						$rootScope.showNotif('Tanks log you or create an account.', 'error');
					}
				} else if(restrict == 2){
					$location.path("/index");
					$rootScope.showNotif('You don\'t allow for this page.', 'error');
				}
			}
		});

/* Notification Error */
		// Type : notice, warning, error, success
		$rootScope.showNotif = function(msg, type){
			if(appConfig.debug){
				var flag = false;
				setTimeout( function() {
					if(flag) return;
					flag = true;
						// create the notification
						var notification = new NotificationFx({
							message : '<span class="icon icon-'+type+'"></span><p>'+msg+'.</p>',
							layout : 'attached',
							effect : 'bouncyflip',
							type : type, // notice, warning or error
							onClose : function() {
								flag = false;
							}
						});
						// show the notification
						notification.show();
					}, 1200 );
			}
		};

		/* Manage cookie token */
		$rootScope.getToken = function(){
			if(localStorage.getItem("token")){
				return localStorage.getItem("token");
			}else if($cookies.token != null || $cookies.token != "undefined") {
				return $cookies.token;
			}else {
				return null;
			}
		};

		$rootScope.getApi = function() {
			return getApiAddr().substr(0, getApiAddr().length-4);
		};

		$rootScope.onPlayerReady = function($API) {
			console.log($API);
            $rootScope.API = $API;
        };
		
		$rootScope.stopVideo = function(){
			$rootScope.API.stop();
		};

		$rootScope.logOut = function() {
			if($rootScope.getToken()){
				$callService.logout($rootScope.getToken(), function (success, data) {
					if(success){
						localStorage.removeItem('user');
						localStorage.removeItem('token');
						$route.reload();
					}else {
						$rootScope.showNotif(data, 'notice');
					}
				});
				// TODO error callback
				$cookies.token = undefined;
				appStorage.delete("user");
				$route.reload();
			}else {
				$rootScope.showNotif('You don\'t allow.', 'error');
			}
		};


		/* Settings Http Error */
		$rootScope.httpError = function(code, err){
			if(401 == code) {
				$location.path("/");
				console.log('Error 401');
			}else if(500 == code || 503 == code){
				console.log('Error 500 or 503');
				$location.path("/");
			}else if(404 == code){
				console.log('Error 404');
				$location.path("/");
			}else{
				console.log('Error inconue', err);
			}
		};

	}]);

mewPipeApp.filter('getById', function () {
	return function (input, id) {
		var i = 0, len = input.length;
		for (; i < len; i++) {
			if (+input[i].id === +id) {
				return input[i];
			}
		}
		return null;
	};
});