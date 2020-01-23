var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    subscriptions: [String],
    references: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('user', userSchema);