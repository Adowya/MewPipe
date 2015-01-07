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
						'x-access-token': '812b931f37c8fcfba752a33f8cf565b64b54e68e7640effda41c990be2749c1dfab40a912290ffcbb2e66693d98c029d'
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