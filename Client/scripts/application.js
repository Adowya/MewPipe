var mewPipeApp = angular.module('mewPipeApp', [
	'ngAnimate',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ui.sortable',
	'callModule',
	'angularFileUpload',
	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"com.2fdevs.videogular.plugins.overlayplay",
	"com.2fdevs.videogular.plugins.poster"
	]);

mewPipeApp.run([
	'$rootScope',
	'$http',
	function ($rootScope, $http, $location) {

		/* Notification Error */
		$rootScope.alertMsg = '';
		$rootScope.alert = {
			show :false
		};
		$rootScope.showNotif = function(msg){
			if(appConfig.debug){
				$rootScope.alertMsg = msg;
				$rootScope.alert = {
					show :true
				};
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