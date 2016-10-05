ChatApp.service('ApiService', function($http, UserService) {
  var ApiService = this;

  ApiService.login = function(data) {
    return $http.post('/api/login', data);
  };

  ApiService.invite_friend = function(username) {
    return $http.post('/api/invite', {
      token: UserService.user.token,
      invite: username
    });
  };
  
  ApiService.remove_friend = function(username) {
    return $http.post('/api/friend/remove', {
      token: UserService.user.token,
      remove: username
    });
  };
  
  ApiService.accept_invite = function(username) {
    return $http.post('/api/invite/accept', {
      token: UserService.user.token,
      friend: username
    });
  };

  return ApiService;
});

ChatApp.service('UserService', function() {
  var UserService = this;
  UserService.user = {
    token: null,
    user: null
  };
  
  UserService.listeners = new Map();
  UserService.update_listeners = function () {
    for (var l of UserService.listeners.values()) {
      l();
    }
  };

  UserService.set_user = function(data) {
    UserService.user.token = data.token;
    UserService.user.profile = data.user;
  };
  return UserService;
});

ChatApp.service('DialogService', function($mdDialog, $mdToast) {
  var DialogService = this;
  
  DialogService.show_error = function(message) {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Error')
        .textContent(message)
        .ariaLabel('Error')
        .ok('OK')
    );
  };
  
  DialogService.toast = function (message) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .hideDelay(5000)
    );
  };
  
  return DialogService;
});

ChatApp.service('SocketService', function (UserService, MessageService) {
  var SocketService = this;
  SocketService.socket = io();
  
  SocketService.connect = function () {
    console.log('User Connected');
    if (UserService.user.token) {
      SocketService.login();
    }
  };
  
  SocketService.disconnect = function () {
    console.log('user disconnected');
  };
  
  SocketService.login = function () {
    SocketService.socket.emit('login', {token: UserService.user.token});
    var updates = 'updates:' + UserService.user.token;
    if (!SocketService.socket.hasListeners(updates)) {
      SocketService.socket.on(updates, SocketService.user_updates);
    }
  };
  
  SocketService.user_updates = function (data) {
    console.log(data);
    if (data.invites) {
      UserService.user.profile.invites = data.invites;
      UserService.update_listeners();
    }
    
    if (data.friends) {
      UserService.user.profile.friends = data.friends;
      UserService.update_listeners();
    }
    
    if (data.message) {
      if (!MessageService.messages[data.message.conversation]) {
        MessageService.messages[data.message.conversation] = [];
      }
      MessageService.messages[data.message.conversation].push([data.message.from, data.message.content]);
      MessageService.update_listeners(data.message.conversation);
    }
  };
  
  SocketService.send_message = function (to, message) {
    SocketService.socket.emit('chat', {to: to, message: message})
  };
  
  SocketService.socket.on('connect', SocketService.connect);
  SocketService.socket.on('disconnect', SocketService.disconnect);

  return SocketService;
});

ChatApp.service('MessageService', function () {
  var MessageService = this;
  
  MessageService.messages = {};
  MessageService.listeners = new Map();
  
  MessageService.update_listeners = function (conversation) {
    for (var l of MessageService.listeners.values()) {
      l(conversation);
    }
  };
  
  MessageService.chat_with = function (user) {
    MessageService.messages._active = user;
  };
  
  return this;
});
