var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

module.exports = {
  express: express,
  app: app,
  http: http,
  io: io
};
