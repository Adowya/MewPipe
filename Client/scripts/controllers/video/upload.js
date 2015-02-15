mewPipeApp.controller('VideoUploadCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', '$upload', 
	function($rootScope, $http, $scope, $route, $location, $callService, $upload){

		$scope.videoUpload = function($files) {
			var url = getApiAddr() + apiUrl.route['video_upload'];
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
                console.log(bytesToSize(file.size));
                if(bytesToSize(file.size) <= 500) {
    				$scope.upload = $upload.upload({
    					url: url,
    					method: "POST",
    					headers: {
    						'x-access-token': $rootScope.getToken()
            			},
            			data: {
            				"name": "",
            				"description": "aa",
            				"rights": "public"
            			},
            			file: file,
            		}).progress(function(evt) {
            			$scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
            		}).success(function(data, status, headers, config) {
                        if(success){
                            console.log(data);
                            console.log(status); 
                        }else {
                             $rootScope.showNotif(data.error, 'error');
                        }
            		})
            		.error(function(err){
            			console.log(err);
            			return;
            		});
                }else {
                    $rootScope.showNotif('Video allowed on the platform mustn’t exceed 500MB size.', 'error');
                }

        	}
        };

    }]);