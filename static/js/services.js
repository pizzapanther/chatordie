ChatApp.service('ApiService', function($http, UserService) {
  var ApiService = this;

  ApiService.login = function(data) {
    return $http.post('/api/login', data);
  };
  
  ApiService.invite_friend = function (username) {
    return $http.post('/api/invite', {token: UserService.user.token, username: username});
  };

  return ApiService;
});

ChatApp.service('UserService', function() {
  var UserService = this;
  UserService.user = {token: null, user: null};
  
  UserService.set_user = function (data) {
    UserService.user.token = data.token;
    UserService.user.profile = data.user;
  };
  return UserService;
});
