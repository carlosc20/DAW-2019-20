var Post = require('../models/post')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId

module.exports.list = () => {
    return Post.model.find()
        .exec()
}

module.exports.insert = (post)  => {
    return post.save()
}

module.exports.getById = (id) => {
    return Post.model.find({_id: ObjectId(id)}, {})
}

module.exports.getByTag = (tag) => {
    returnPost.model.find({hashTags: tag}, {})
        .exec()
}