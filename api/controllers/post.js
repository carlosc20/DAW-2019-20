var Post = require('../models/post')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId

module.exports.list = () => {
    return Post.find()
        .exec()
}

module.exports.insert = (post)  => {
    var p = new Post(post)
    return p.save();
}

module.exports.getById = (id) => {
    return Post.findOne({_id: ObjectId(id)}, {})
}

module.exports.getByTag = (tag) => {
    return Post.find({hashTags: tag}, {})
        .exec()
}