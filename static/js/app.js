var ChatApp = angular.module('ChatApp', ['ngMaterial', 'ngMessages', 'ngRoute']);

function AuthRequired(UserService) {
  return UserService.user;
}

ChatApp.config(function($mdThemingProvider, $routeProvider, $locationProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('grey')
    .dark();

  $routeProvider
    .when('/login', {
      templateUrl: '/static/tpl/login.html',
      controller: 'LoginCtrl'
    })
    .when('/chat', {
      templateUrl: '/static/tpl/chat.html',
      controller: 'MainChatCtrl',
      resolve: {
        user: AuthRequired
      }
    })
    .otherwise({
      redirectTo: '/login'
    });

  $locationProvider.html5Mode(true);
});

