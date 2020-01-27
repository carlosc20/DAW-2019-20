var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    name: String,
    mimetype: String,
    size: Number
})

var requestSchema = new mongoose.Schema({
    requester: String, 
    group: String
})


var groupSchema = new mongoose.Schema({
    name: String,
    owner: Boolean
})

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: imageSchema,
    subscriptions: [String],
    requestsRcv: [requestSchema], 
    groups: [groupSchema],
    mentions: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('user', userSchema);