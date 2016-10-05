ChatApp.component('friendsList', {
  templateUrl: '/static/tpl/components/friends-list.html',
  controller: function($scope, $mdDialog, ApiService, DialogService, SocketService, UserService, MessageService) {
    SocketService.login();

    this.user = UserService.user.profile;

    this.add_friend = function() {
      var confirm = $mdDialog.prompt()
        .title('Add A Friend')
        .placeholder('Friend\'s Username')
        .ariaLabel('Friend\'s Username')
        .ok('Add')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        ApiService.invite_friend(result).then(function(response) {
          DialogService.toast('Friend Invited Successfully');
        }).catch(function(response) {
          DialogService.show_error('Error Adding Friend.');
        });
      }, function() {
        console.log('Cancelled Add Friend');
      });
    };

    this.accept_invite = function(invite) {
      ApiService.accept_invite(invite.username).then(function() {
        DialogService.toast('Invite Accepted');
      }).catch(function() {
        DialogService.show_error('Error Accepting Friend.');
      });
    };

    this.remove_friend = function(friend) {
      var confirm = $mdDialog.confirm()
        .title('Removal Confirmation')
        .textContent('Are you sure you wish to remove ' + friend.username + '?')
        .ariaLabel('Removal Confirmation')
        .ok('Yes')
        .cancel('Nope we\'re BFFs');

      $mdDialog.show(confirm).then(function() {
        ApiService.remove_friend(friend.username).then(function(response) {
          DialogService.toast('Friend Removed Successfully');
        }).catch(function(response) {
          DialogService.show_error('Error Removing Friend.');
        });
      }, function() {
        console.log('cancelled');
      });
    };

    this.messages = MessageService.messages;
    this.active = MessageService.active;
    this.chat_with = MessageService.chat_with;
    this.listener = () => {
      $scope.$apply();
    };

    UserService.listeners.set('friend-list', this.listener);
    MessageService.listeners.set('friend-list', this.listener);
  }
});

ChatApp.component('chat', {
  templateUrl: '/static/tpl/components/chat.html',
  controller: function($scope, $timeout, MessageService, SocketService) {
    this.messages = MessageService.messages;
    this.active = MessageService.active;
    this.form = {};

    this.activate = MessageService.chat_with;
    this.send_message = (user) => {
      SocketService.send_message(user, this.form.message);
      this.form.message = '';
    };

    this.listener = (conversation) => {
      $scope.$apply();
      
      if (conversation == this.active.on) {
        MessageService.messages[conversation].unread = false;
      }
      
      $timeout(function() {
        var e = document.querySelector('chat md-card.' + conversation + ' md-content');
        if (e) {
          e.scrollTop = e.scrollHeight;
        }
      });
    };

    MessageService.listeners.set('main-chat', this.listener);
  }
});
