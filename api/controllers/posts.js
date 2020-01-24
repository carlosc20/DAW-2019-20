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

module.exports.delete = (id) => {
    return Post.deleteOne({_id: Object(id)})
}

module.exports.getById = (id) => {
    return Post.findOne({_id: ObjectId(id)}, {})
}

module.exports.getByIdForMentions = id => {
    return Post.findOne({_id: ObjectId(id)})
                .select({title:1, poster:1, date:1})
                .exec()
}

module.exports.getByTag = (tag) => {
    return Post.find({tags: tag}, {})
        .exec()
}


module.exports.getByPoster = (poster) => {
    return Post.find({poster: poster}, {})
        .exec()
}

module.exports.sortedList = () => {
    return Post
        .find()
        .sort({date: -1})
        .exec()
}

module.exports.addComment = (idPost, comment) => {
    console.log("adding comment to " + idPost)
    console.dir(comment)
    return Post.updateOne({_id: ObjectId(idPost)}, {$push: { comments: comment }}).exec()
}