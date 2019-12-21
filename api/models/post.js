var mongoose = require('mongoose')

var fileSchema = new mongoose.Schema({
    name: String,
    mimetype: String,
    size: Number
})

var Post = new mongoose.Schema({
    title: String,
    poster: String,
    description: String,
    date: String,
    tags: Array,
    files: [fileSchema],
    comments: Array
    // likes/dislikes, updates/edits   
})

module.exports = mongoose.model('post', Post);