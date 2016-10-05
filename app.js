var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var main = require('./main.js');
var views = require('./views.js');
var socket = require('./socket.js');

main.app.use(logger('dev'));
main.app.use(bodyParser.json());
main.app.use(bodyParser.urlencoded({
  extended: true
}));

main.app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
main.app.get('/', views.homepage);
main.app.use('/api', views.api);
main.app.use('/static', main.express.static(__dirname + '/static'));
main.app.use('/dep', main.express.static(__dirname + '/node_modules'));
main.app.get('/*', views.homepage);

main.io.on('connection', socket.channel);

var port = process.env.PORT || '8000';
main.http.listen(port, function() {
  console.log('Listening on port ' + port);
});
