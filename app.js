var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var app = express();
app.use(logger('dev'));

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use('/static', express.static(__dirname + '/static'));

var port = process.env.PORT || '8000';
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
