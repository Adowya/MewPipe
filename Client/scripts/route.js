/***
** ROUTE
***/

mewPipeApp.config(['$routeProvider',
  function($routeProvider) {

    $routeProvider.

    when('/',{
      templateUrl: 'views/index.html',
      controller: 'MainCtrl',
      restrict: 0
    })


    .when('/video/upload',{
      templateUrl: 'views/video/upload.html',
      controller: 'VideoUploadCtrl',
      restrict: 1
    })

    .when('/video/download/:param', {
      templateUrl: 'views/video/download.html', 
      controller: 'VideoDownloadCtrl',
      restrict: 0
    })

    .when('/video/show/:param',{
      templateUrl: 'views/video/show.html',
      controller: 'VideoShowCtrl',
      restrict: 1
    })

    .when('/video/update/:param',{
      templateUrl: 'views/video/update.html',
      controller: 'VideoUpdateCtrl',
      restrict: 1
    })

    .when('/video/user/:param',{
      templateUrl: 'views/video/user.html',
      controller: 'VideoUserCtrl',
      restrict: 1
    })

    .when('/user/profile',{
      templateUrl: 'views/user/profile.html',
      controller: 'UserProfileCtrl',
      restrict: 1
    })



    .otherwise({
      redirectTo:'/'
    });

  }]);
