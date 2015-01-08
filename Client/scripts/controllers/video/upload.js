mewPipeApp.controller('VideoUploadCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$upload', 
	function($rootScope, $http, $scope, $route, $location, $callService, $upload){

		$scope.videoUpload = function($files) {
			var url = getApiAddr() + apiUrl.route['video_upload'];
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				$scope.upload = $upload.upload({
					url: url,
					method: "POST",
					headers: {
						'x-access-token': 'ae342c7054cf1cec9da50874e1cd5acffd7f087d4255ccf30ef6fc40a5fc580b1a8a58ed1231ee707aee1f63fb3127f8'
        			},
        			data: {
        				"_user": "549223d71542501db1c10a69",
        				"name": $files[i].name,
        				"description": "aa",
        				"rights": "public"
        			},
        			file: file,
        		}).progress(function(evt) {
        			$scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
        		}).success(function(data, status, headers, config) {
        			console.log(data);
        			console.log(status);
        		})
        		.error(function(err){
        			console.log(err);
        			return;
        		});

        	}
        };

    }]);