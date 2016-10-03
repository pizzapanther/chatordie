var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var mongo_url = process.env.MONGODB_URI || 'mongodb://localhost/chatordie';
mongoose.connect(mongo_url);

var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  invites: [{
    type: ObjectId,
    ref: 'User'
  }],
  friends: [{
    type: ObjectId,
    ref: 'User'
  }]
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
};
