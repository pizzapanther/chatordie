ChatApp.component('friendsList', {
  templateUrl: '/static/tpl/components/friends-list.html',
  controller: function ($mdDialog, ApiService) {
    this.add_friend = function () {
      var confirm = $mdDialog.prompt()
        .title('Add A Friend')
        .placeholder('Friend\'s Username')
        .ariaLabel('Friend\'s Username')
        .ok('Add')
        .cancel('Cancel');
  
      $mdDialog.show(confirm).then(function(result) {
        console.log(result);
      }, function() {
        console.log('Cancelled Add Friend');
      });
    };
  }
});

ChatApp.component('chat', {
  templateUrl: '/static/tpl/components/chat.html'
});