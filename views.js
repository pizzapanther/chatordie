var express = require('express');
var express_api = require('express-api-helper');

var models = require('./models.js');

var home = express.Router();
var api = express.Router();

home.get('/', function(request, response) {
  response.send('Hello World!');
});

function error_response(request, response, message) {
  return function(error) {
    console.log(error);
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
            token: username
          });
        });

        p.catch(error_response('Error creating user.'));
      } else {
        // really insecure token :-)
        express_api.ok(request, response, {
          token: username
        });
      }
    });

    promise.catch(error_response('Database Error'));
  } else {
    return express_api.badRequest(request, response, 'No Username');
  }
});

module.exports = {
  'homepage': home,
  'api': api
};
