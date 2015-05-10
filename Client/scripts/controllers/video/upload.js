mewPipeApp.controller('VideoUploadCtrl', ['$rootScope', '$http', '$scope', '$route', '$location', '$callService', 'Upload',
    function ($rootScope, $http, $scope, $route, $location, $callService, Upload) {

        // $scope.$watch('files', function () {
        //     console.log($scope.files);
        // });

        $scope.submitUpload = function () {
            var url = getApiAddr() + api.route['video_upload'];
            if (typeof $scope.files !== 'undefined') {
                console.log($scope.files);
                for (var i = 0; i < $scope.files.length; i++) {
                    var file = $scope.files[i];
                    console.log(bytesToSize(file.size));
                    if (file.size <= 524288000) {
                        $scope.upload = Upload.upload({
                            url: url,
                            method: "POST",
                            headers: {
                                'x-access-token': $rootScope.app.getToken()
                            },
                            data: {
                                "name": file.name,
                                "description": file.description,
                                "rights": file.rights
                            },
                            file: file,
                        }).progress(function (evt) {
                            $scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
                        }).success(function (data, status, headers, config) {
                            if (data.success) {
                                console.log('success', data);
                                $scope.files = [];
                                // $location.path('/video/show/'+data._id);
                            } else {
                                console.log('error', data);
                                $rootScope.app.showNotif(data.error, 'error');
                            }
                        })
                            .error(function (err, code) {
                            $rootScope.app.httpError(err, code);
                        });
                    } else {
                        $rootScope.app.showNotif('Video allowed on the platform mustn’t exceed 500MB size.', 'error');
                    }

                }
            } else {
                console.log('check nothing file to upload');
            }
        };

        $scope.tags = [{ name: 'Animation', checked: false },
            { name: 'Arts & Design', checked: false },
            { name: 'Cameras & Techniques', checked: false },
            { name: 'Comedy', checked: false },
            { name: 'Documentary', checked: false },
            { name: 'Experimental', checked: false },
            { name: 'Fashion', checked: false },
            { name: 'Food', checked: false },
            { name: 'Instructionals', checked: false },
            { name: 'Music', checked: false },
            { name: 'Narrative', checked: false },
            { name: 'Personal', checked: false },
            { name: 'Reporting & Journalism', checked: false },
            { name: 'Sports', checked: false },
            { name: 'Talks', checked: false },
            { name: 'Travel', checked: false },
        ]

    }]);