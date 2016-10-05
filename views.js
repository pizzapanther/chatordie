var express = require('express');
var express_api = require('express-api-helper');
var Q = require('q');

var main = require('./main.js');
var models = require('./models.js');

var api = express.Router();

function homepage(request, response) {
  response.sendFile(__dirname + '/static/index.html');
}

function error_response(request, response, message) {
  return function(error) {
    console.error(error);
    express_api.serverError(request, response, message);
  };
}

api.post('/login', function(request, response) {
  var username = request.body.username;
  if (username) {
    var promise = models.User.findOne({
      'username': username
    }).populate('invites').populate('friends').exec();
    promise.then(function(user) {
      //console.log(user);
      if (!user) {
        user = new models.User({
          username: username
        });
        var p = user.save();

        p.then(function() {
          // really insecure token :-)
          console.log('Created: ', username);
          express_api.ok(request, response, {
            token: username,
            user: user.toJSON()
          });
        });

        p.catch(error_response('Error creating user.'));
      } else {
        // really insecure token :-)
        express_api.ok(request, response, {
          token: username,
          user: user.toJSON()
        });
      }
    });

    promise.catch(error_response('Database Error'));
  } else {
    return express_api.badRequest(request, response, 'No Username');
  }
});

api.post('/invite/accept', function(request, response) {
  var friend = request.body.friend;
  var request_user = request.body.token;

  if (friend && request_user) {
    var p1 = models.User.findOne({
      'username': request_user
    }).populate('invites').populate('friends').exec();
    var p2 = models.User.findOne({
      'username': friend
    }).populate('friends').exec();

    var promise = Q.all([p1, p2]);
    promise.then(function(users) {
      if (users && users[0] && users[1]) {
        var user = users[0];
        var friend = users[1];

        var keep = [];
        user.invites.forEach(function(invite) {
          if (invite.username != friend.username) {
            keep.push(invite);
          }
        });
        user.invites = keep;

        user.friends.push(friend);
        friend.friends.push(user);

        var s1 = friend.save();
        var s2 = user.save();
        var saves = Q.all([s1, s2]);
        saves.then(function() {
          express_api.ok(request, response, {
            status: 'updated'
          });

          main.io.emit('updates:' + user.username, {
            'friends': user.friends,
            invites: user.invites
          });
          main.io.emit('updates:' + friend.username, {
            'friends': friend.friends
          });
        }).catch(error_response('Database error'));
      } else {
        express_api.notFound(request, response);
      }
    });
    promise.catch(error_response('Database error'));
  } else if (request_user) {
    return express_api.badRequest(request, response, 'No Friend User');
  } else {
    return express_api.badRequest(request, response, 'No Request User');
  }
});

api.post('/invite', function(request, response) {
  var invite = request.body.invite;
  var request_user = request.body.token;
  if (invite && request_user) {
    var p1 = models.User.findOne({
      'username': request_user
    }).exec();
    var p2 = models.User.findOne({
      'username': invite
    }).populate('invites').exec();

    var promise = Q.all([p1, p2]);
    promise.then(function(users) {
      if (users && users[0] && users[1]) {
        var user = users[0];
        var invited = users[1];

        invited.invites.push(user);
        invited.save().then(function() {
          express_api.ok(request, response, {
            status: 'added'
          });
          main.io.emit('updates:' + invited.username, {
            'invites': invited.invites
          });
        }).catch(error_response('Database error'));
      } else {
        express_api.notFound(request, response);
      }
    });
    promise.catch(error_response('Database error'));
  } else if (request_user) {
    return express_api.badRequest(request, response, 'No Invite User');
  } else {
    return express_api.badRequest(request, response, 'No Request User');
  }
});

api.post('/friend/remove', function(request, response) {
  var remove = request.body.remove;
  var request_user = request.body.token;

  if (remove && request_user) {
    var u1 = models.User.findOne({
      'username': request_user
    }).populate('friends').exec();
    var u2 = models.User.findOne({
      'username': remove
    }).populate('friends').exec();

    var users = Q.all([u1, u2]);
    users.then(function(ulist) {
      if (ulist && ulist[0] && ulist[1]) {
        var user = ulist[0];
        var removed = ulist[1];

        var keep1 = [];
        user.friends.forEach(function(f) {
          if (f.username != removed.username) {
            keep1.push(f);
          }
        });
        user.friends = keep1;

        var keep2 = [];
        removed.friends.forEach(function(f) {
          if (f.username != user.username) {
            keep2.push(f);
          }
        });
        removed.friends = keep2;

        var s1 = user.save();
        var s2 = removed.save();
        var saves = Q.all([s1, s2]);
        saves.then(function() {
          express_api.ok(request, response, {
            status: 'updated'
          });

          main.io.emit('updates:' + user.username, {
            'friends': user.friends
          });
          main.io.emit('updates:' + removed.username, {
            'friends': removed.friends
          });
        }).catch(error_response('Database error'));
      } else {
        express_api.notFound(request, response);
      }
    });
    users.catch(error_response('Database error'));
  } else if (request_user) {
    return express_api.badRequest(request, response, 'No Invite User');
  } else {
    return express_api.badRequest(request, response, 'No Remove User');
  }
});

module.exports = {
  'homepage': homepage,
  'api': api,
  'error_response': error_response
};
