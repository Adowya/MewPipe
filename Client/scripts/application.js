var mewPipeApp = angular.module('mewPipeApp', [
	'ngAnimate',
	'ngResource',
	'ngCookies',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ngFileUpload',
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

				if($rootScope.app.getToken() && $rootScope.app.getToken() != "undefined"){
					$rootScope.isConnect = true;
					if(localStorage.getItem("user") && localStorage.getItem("user") == "undefined"){
						$callService.requestGet('user_readOne', null, $rootScope.app.getToken(), function (success, data) {
							if(success){
								appStorage.set("user", data);
							}else {
								$rootScope.app.showNotif(data, 'notice');
							}
						});
					}
				}else {
					$rootScope.isConnect = false;
					$cookies.token = undefined;
					var user;
					appStorage.set("user", user);
				}

	           /** 
				* Restrict Auth
				* 0 = Allow-*
				* 1 = Allow-User
				* 2 = Allow-Admin
			    */ 
				var restrict = current.$$route.restrict;
				if(restrict == 1){
					if(!$rootScope.isConnect){
						$location.path("/");
						$rootScope.app.showNotif('Tanks log you or create an account.', 'error');
					}
				} else if(restrict == 2){
					$location.path("/index");
					$rootScope.app.showNotif('You don\'t allow for this page.', 'error');
				}
			}
		});
		
		
		$rootScope.app = {
			
			/** 
			 * Return Api address
			 */
			getApi: function() {
				return getApiAddr().substr(0, getApiAddr().length-4);
			},
			
			/**
			 * Return Token from localstorage or cookie
			 */
			getToken: function() {
				if (localStorage.getItem("token")) {
					return localStorage.getItem("token");
				} else if ($cookies.token != null || $cookies.token != "undefined") {
					return $cookies.token;
				} else {
					return null;
				}
			},
			
			/**
			 * Show notification multi type
			 * @msg String message to show
			 * @Type String 'notice', 'warning', 'error' or 'success'
			 */
			showNotif: function(msg, type) {
				if (appConfig.debug) {
					var flag = false;
					setTimeout(function () {
						if (flag) return;
						flag = true;
						// create the notification
						var notification = new NotificationFx({
							message: '<span class="icon icon-' + type + '"></span><p>' + msg + '.</p>',
							layout: 'attached',
							effect: 'bouncyflip',
							type: type, // notice, warning or error
							onClose: function () {
								flag = false;
							}
						});
						// show the notification
						notification.show();
					}, 1200);
				}
			},
			
			/**
			 * Catch request error 
			 * @Error message
			 * @Code code http error
 			 */
			httpError: function(err, code) {
				if (401 == code) {
					$location.path("/");
					console.error('Error 401');
				} else if (404 == code) {
					$location.path("/");
					console.error('Error 404');
				} else if (500 == code || 503 == code) {
					$location.path("/");
					console.error('Error 500 or 503');
				} else {
					console.error('Error inconue', err, code);
				}
			},
			
			/**
			 * Generique object type videogular with custom functions
			 */
			video : {
				name: "",
				description: "",
				created: "",
				size: "",
				views: 0,
				sources: [
					{
						src: $sce.trustAsResourceUrl('${this.getApi()}/api/videos/download/${video_id}'),
						type: "video/mp4"
					}
				],
				plugins: {
					poster: ""
				},
				theme: "lib/videogular-themes-default/videogular.css",
				
				/**
				 * Return obj videogular formated
				 */
				download: function(id) {
					$rootScope.app.video.sources[0].src = $sce.trustAsResourceUrl($rootScope.app.getApi()+'/api/videos/download/'+id);
					return angular.copy($rootScope.app.video);
				},
				
				play: function(id){
					$rootScope.app.video.sources[0].src = $sce.trustAsResourceUrl($rootScope.app.getApi()+'/api/videos/play/'+id);
					return angular.copy($rootScope.app.video);
				},
				
				link: function(id) {
					/**
					 * Todo request API
					 */
					/*$callService.requestGet('share_create', id, null, function (success, data) {
						console.log(success);
						console.log(data);
						if(success){
							console.log(data);
							return data;
						}else{
							$rootScope.app.showNotif(data, 'notice');
						}
					});*/
				},
				
				/**
				 * Stop all players
				 */
				stop: function() {
					
				}, 
				
				/**
				 * onPlayerReady()
				 * return obj videogular-control
				 */
				onPlayerReady: function($API) {
					console.log($API);
				}
			}
		};
		
		/**
		 * Auth Logout 
		 */
		$rootScope.logOut = function() {
			if($rootScope.app.getToken()){
				$callService.logout($rootScope.app.getToken(), function (success, data) {
					if(success){
						localStorage.removeItem('user');
						localStorage.removeItem('token');
						$route.reload();
					}else {
						$rootScope.app.showNotif(data, 'notice');
					}
				});
				// TODO error callback
				$cookies.token = undefined;
				appStorage.delete("user");
				$route.reload();
			}else {
				$rootScope.app.showNotif('You don\'t allow.', 'error');
			}
		};

	}]);