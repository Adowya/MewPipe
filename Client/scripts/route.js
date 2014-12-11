/***
** ROUTE
***/
mewPipeApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/index',{
      templateUrl: 'views/index.html',
      restrict: 0
    })

      //Download_file
      .when('/download/:param1', {
        templateUrl: 'views/manager/download.html', 
        controller: 'downloadCtrl',
        restrict: 0,
        style: ''
      })

    /***
    ** User
    ***/
    
    .when('/profile',{
      templateUrl: 'views/user/profile.html',
      controller: 'profileCtrl',
      restrict: 1,
      style: 'css/views/profile.css'
    })
    .otherwise({
      redirectTo:'/index'
    });

  }]);
