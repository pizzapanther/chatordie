ChatApp.controller('AppCtrl', function($scope, UserService) {
  $scope.user = UserService.user;
});

ChatApp.controller('LoginCtrl', function($scope, $location, ApiService, UserService, DialogService) {
  $scope.form = {};

  $scope.do_login = function() {
    if ($scope.login_form.$valid) {
      ApiService.login($scope.form).then(function(response) {
        UserService.set_user(response.data);
        $location.path('/chat');
      }).catch(function() {
        DialogService.show_error('Error logging in.');
      });
    }
  };
});

ChatApp.controller('MainChatCtrl', function($scope, $location, user) {
  if (!user.token) {
    $location.path('/login');
  }
});
