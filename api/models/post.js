var mongoose = require('mongoose')
var identifier = require('../models/identifier');
var mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

var fileSchema = new mongoose.Schema({
    name: String,
    mimetype: String,
    size: Number
})

var commentSchema = new mongoose.Schema({
    text : String,
    owner : String,
    date : String,
    upVotes : [String],
    downVotes : [String]
})

var identifierSchema = new mongoose.Schema({
    tag: String,
    public: Boolean,
    owner: String
})

var Post = new mongoose.Schema({
    title: String,
    poster: String,
    description: String,
    date: String,
    tags: [identifierSchema],
    files: [fileSchema],
    comments: [commentSchema],
    upVotes: [String],
    downVotes : [String]
    // updates/edits   
})

Post.plugin(mongoose_fuzzy_searching, {fields: ['title']})

module.exports = mongoose.model('post', Post);