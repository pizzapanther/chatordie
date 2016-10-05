var main = require('./main.js');

function channel(socket) {
  console.log('Socket Connected');
  var owner;

  socket.on('login', function(user) {
    if (user && user.token) {
      console.log('User Login:', user.token);
      socket.join('updates:' + user.token);
      owner = user.token;
    }
  });

  socket.on('chat', function(data) {
    console.log('Message', data);
    if (owner) {
      main.io.emit('updates:' + data.to, {
        message: {
          conversation: owner,
          from: owner,
          content: data.message
        }
      });
      main.io.emit('updates:' + owner, {
        message: {
          conversation: data.to,
          from: owner,
          content: data.message
        }
      });
    }
  });
}

module.exports = {
  channel: channel
};
