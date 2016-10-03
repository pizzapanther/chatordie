ChatApp.service('ApiService', function ($http) {
  var ApiService = this;
  
  ApiService.login = function (data) {
    return $http.post('/api/login', data);
  };
  
  return ApiService;
});

ChatApp.service('UserService', function () {
  var UserService = this;
  UserService.user = {};
  return UserService;
});
