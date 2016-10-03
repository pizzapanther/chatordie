var ChatApp = angular.module('ChatApp', ['ngMaterial', 'ngMessages', 'ngRoute']);

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
      controller: 'ChatCtrl'
    })
    .otherwise({
      redirectTo: '/login'
    });

  $locationProvider.html5Mode(true);
});

