var mewPipeApp = angular.module('mewPipeApp', [
	'ngAnimate',
	'ngResource',
	'ngCookies',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ui.sortable',
	'callModule',
	'angularFileUpload',
	'xeditable',
	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"com.2fdevs.videogular.plugins.overlayplay",
	"com.2fdevs.videogular.plugins.poster"
	]);

mewPipeApp.run([
	'$rootScope',
	'$http',
	'$location',
	'$cookies',
	function ($rootScope, $http, $location, $cookies) {

		/* Notification Error */
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
			if($cookies.token != (null || '')) {
				return $cookies.token;
			}else {
				return null;
			}
		}



		$rootScope.initParam = [];
		$rootScope.init = function (dataKey) {
			if (dataKey ){
				$rootScope.initParam = dataKey;
			}
		};


		/* Debug log */
		// if (appConfig.debug) {
		// 	console.log = function (log) {
		// 		return function () {
		// 			var args = Array.prototype.slice.call(arguments);
		// 			log.apply(console, args);
		// 			var logs = [];
		// 		};
		// 	}(console.log);
		// }

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
				console.log('Error inconue');
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