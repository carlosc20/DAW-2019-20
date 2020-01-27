var mongoose = require('mongoose');

var identifierSchema = new mongoose.Schema({
    tag: String,
    public: Boolean,
    owner: String
})

module.exports = mongoose.model('identifier', identifierSchema);