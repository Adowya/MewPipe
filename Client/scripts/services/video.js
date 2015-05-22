'use strict';
var MewPipeModule = angular.module('ServiceModule');
MewPipeModule.factory('$videoService', [
	'$rootScope', '$q', '$sce',
	function ($rootScope, $q, $sce) {

		/**
		 * Generique object videogular with custom functions 
		 * Return {object} videogular formated
		 */
		var $videoService = function (data, action) {

			if (action == "download") {
				action = [{
					src: $sce.trustAsResourceUrl($rootScope.app.getApi() + '/api/videos/download/' + data._id),
					type: "video/" + data.ext
				}];
			} else if (action == "play") {
				action = [{
					src: $sce.trustAsResourceUrl($rootScope.app.getApi() + '/api/videos/play/' + data._id),
					type: "video/" + data.ext
				}];
			} else {
				action = [{
					src: data.sources,
					type: "video/" + data.ext
				}];
			}

			return {
				_id: data._id,
				_user: data._user,
				name: data.name,
				description: data.description,
				created: moment(data.date).format("MM/DD/YYYY"),
				size: bytesToSize(data.size),
				views: data.views,
				rights: data.rights,
				sources: action,
				plugins: {
					poster: ''
				},
				theme: "lib/videogular-themes-default/videogular.css",
				image: config.getApiAddr() + config.api.route['video_image'] + "/" + data._id,

				link: function (id) {

				},
				stop: function () {

				},
				onPlayerReady: function ($API) {
					console.log($API);
				}
			};
		};

		return $videoService;

	}]);  