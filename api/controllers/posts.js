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

module.exports.getByTag = (tag, page) => {
    page = page || 0
    return Post.find({'tags.tag': tag}, {})
        .sort({date: -1})
        .skip((page)*15)
        .limit(15)
        .exec()
}


module.exports.getByPoster = (poster) => {
    return Post.find({poster: poster}, {})
        .exec()
}

module.exports.sortedList = (page) => {
    if(!page || page < 0) page=0
    return Post
        .find()
        .sort({date: -1})
        .skip((page)*15)
        .limit(15)
        .exec()
}

module.exports.addComment = (idPost, comment) => {
    console.log("adding comment to " + idPost)
    console.dir(comment)
    return Post.updateOne({_id: ObjectId(idPost)}, {$push: { comments: comment }}).exec()
}

module.exports.upvoteComment = (idComment, email) => {
    return Post
            .updateOne({'comments._id': Object(idComment)}, {$pull: {'comments.$.downVotes' : email}, $push : {'comments.$.upVotes': email} })
            .exec()
}

module.exports.downvoteComment = (idComment, email) => {
    return Post
            .updateOne({'comments._id': Object(idComment)}, {$pull: {'comments.$.upVotes' : email} ,$push : {'comments.$.downVotes': email} })
            .exec()
}

module.exports.downVotePost = (idPost, email) => {
    return Post
            .updateOne({_id : ObjectId(idPost)}, {$pull : {upVotes: email}, $push : {downVotes : email}})
            .exec()
}

module.exports.upVotePost = (idPost, email) => {
    return Post
            .updateOne({_id : ObjectId(idPost)}, {$pull : {downVotes: email}, $push : {upVotes : email}})
            .exec()

}

module.exports.fuzzySearchByTitle = (title) => {
    return Post.fuzzySearch(title)
}
