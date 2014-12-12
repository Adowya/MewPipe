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


/***
** User
***/

.when('/profile',{
  templateUrl: 'views/user/profile.html',
  controller: 'ProfileCtrl',
  restrict: 1
})


.otherwise({
  redirectTo:'/'
});

}]);
