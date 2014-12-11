var getApiAddr = function (url) {
	if (typeof url !== "undefined") {
		var apiAddr = appConfig.api.prefix + url + appConfig.api.addr;
		return apiAddr;
	}
};


var appStorage = {
	get: function (item) {
		return JSON.parse(localStorage.getItem(item));
	},
	set: function (name, value) {
		var itemString = JSON.stringify(value);
		localStorage.setItem(name, itemString);
		return true;
	},
	delete: function (item) {
		localStorage.removeItem(item);
		return true;
	}
};

var mewPipeApp = angular.module('mewPipeApp', [
	'ngAnimate',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ui.sortable'
	]);

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

mewPipeApp.run([
	'$rootScope',
	'$http',
	function ($rootScope, $http) {

		console.log('Hello world');

	}]);