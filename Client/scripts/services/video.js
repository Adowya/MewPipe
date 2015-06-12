'use strict';
var MewPipeModule = angular.module('ServiceModule');
MewPipeModule.factory('$videoService', [
	'$rootScope', '$q', '$location', '$sce',
	function ($rootScope, $q, $location, $sce) {

		/**
		 * Generique object videogular with custom functions 
		 * Return {object} videogular formated
		 */
		var $videoService = function (data, action) {

			if (data) {
				var created, size;
				if (action == "download") {
					created = moment(data.date).format("DD MMMM YYYY HH:mm");
					size = bytesToSize(data.size);
					action = [{
						src: $sce.trustAsResourceUrl($rootScope.app.getApi() + '/api/videos/download/' + data._id),
						type: "video/" + data.ext
					}];
				} else if (action == "play") {
					created = moment(data.date).format("DD MMMM YYYY HH:mm");
					size = bytesToSize(data.size);
					action = [{
						src: $sce.trustAsResourceUrl($rootScope.app.getApi() + '/api/videos/play/' + data._id + '/' + $rootScope.app.getToken()),
						type: "video/" + data.ext
					}];
				} else {
					created = data.created;
					size = data.size;
					action = [{
						src: data.sources,
						type: "video/" + data.ext
					}];
				}
			}
			var url = $location.absUrl();
			return {
				_id: data._id,
				_user: data._user,
				name: data.name,
				description: data.description,
				created: created,
				size: size,
				views: data.views,
				rights: data.rights,
				ext: data.ext,
				ready: data.ready,
				sources: action,
				dynamic: 0,
				plugins: {
					poster: ''
				},
				theme: "lib/videogular-themes-default/videogular.css",
				image: config.getApiAddr() + config.api.route['video_image'] + "/" + data._id,

				link: url,
				link2: "#/video/show/" + data._id,
				stop: function () {

				},
				onPlayerReady: function ($API) {
					console.log($API);
				},
				social: {
					facebook: 'Hey if you have few secondes check this video ',
					twitter: 'Hey if you have few secondes check this video ',
				}
			};

		};
		return $videoService;

	}]);  