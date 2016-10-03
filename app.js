var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var views = require('./views.js');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.get('/', views.homepage);
app.use('/api', views.api);
app.use('/static', express.static(__dirname + '/static'));
app.use('/dep', express.static(__dirname + '/node_modules'));
app.get('/*', views.homepage);

var port = process.env.PORT || '8000';
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
