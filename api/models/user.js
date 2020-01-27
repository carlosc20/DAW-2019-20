var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    name: String,
    mimetype: String,
    size: Number
})

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    type: String,
    image: imageSchema,
    subscriptions: [String],
    mentions: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('user', userSchema);