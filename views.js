var express = require('express');
var express_api = require('express-api-helper');
var Q = require('q');

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
    }).exec();
    promise.then(function(user) {
      console.log(user);
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
    }).exec();
    var p2 = models.User.findOne({
      'username': friend
    }).exec();

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
        friends.friends.push(user);

        user.save().then(function() {
          express_api.ok(request, response, {
            status: 'updated'
          });
        // todo: send socket notification
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
    }).exec();

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
        // todo: send socket notification
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

module.exports = {
  'homepage': homepage,
  'api': api,
  'error_response': error_response
};
