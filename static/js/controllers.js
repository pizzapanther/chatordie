ChatApp.controller('ChatCtrl', function($scope, $mdDialog) {
  $scope.show_error = function(message) {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Error')
        .textContent(message)
        .ariaLabel('Error')
        .ok('OK')
    );
  };
});

ChatApp.controller('LoginCtrl', function($scope, $location, ApiService, UserService) {
  $scope.form = {};

  $scope.do_login = function() {
    if ($scope.login_form.$valid) {
      ApiService.login($scope.form).then(function(response) {
        UserService.set_user(response.data);
        $location.path('/chat');
      }).catch(function() {
        $scope.show_error('Error logging in.');
      });
    }
  };
});

ChatApp.controller('MainChatCtrl', function($scope, $location, user) {
  if (!user.token) {
    $location.path('/login');
  }
});
