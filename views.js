var express = require('express');
var api = require('express-api-helper');

var home = express.Router();
var api = express.Router();

home.get('/', function(request, response) {
  response.send('Hello World!');
});

api.post('/login', function(request, response) {
  var username = request.body.username;
  if (username) {
    //todo: get or create

    // really insecure toke :-)
    return api.ok(request, response, {
      token: username
    });
  }

  return api.badRequest(request, response, 'No Username');
});

module.exports = {
  'homepage': home,
  'api': api
};
