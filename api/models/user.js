var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    name: String,
    mimetype: String,
    size: Number
})


var requestSchema = new mongoose.Schema({
    requester: String, 
    tag: String
})


var identifierSchema = new mongoose.Schema({
    tag: String,
    public: Boolean,
    owner: String
})

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    type: String,
    image: imageSchema,
    subscriptions: [identifierSchema],
    requestsRcv: [requestSchema], 
    mentions: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('user', userSchema);