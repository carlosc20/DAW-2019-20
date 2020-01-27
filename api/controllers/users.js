var User = require('../models/user');
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId

module.exports.getAll = () => {
    return User.find()
               .exec()
}

module.exports.getSubscriptions = email =>{
    return User.findOne({email : email})
                .select({subscriptions:1, _id:0})
                .exec()
}

module.exports.get = email => {
    return  User.findOne({email: email})
                .exec()
}

module.exports.getByName = name => {
    return  User.findOne({name: name})
                .exec()
}

module.exports.insert = (user) => {
    console.dir(user)
    user = new User(user)
    return user.save()
}

module.exports.subscribe = (name, subscription) => {
    return User.findOneAndUpdate({name: name},
            {$push: {subscriptions: subscription}})
            .exec()
}

module.exports.unsubscribe = (name, subscription) => {
    return User.findOneAndUpdate({name: name},
            {$pull: {subscriptions: {tag: subscription}}})
            .exec()
}

module.exports.insertMention = (name, postId) => {
    console.log(name, postId)
    return User.findOneAndUpdate({name: name},
                {$push: {mentions: postId}})
                .exec()
}

module.exports.insertImage = (name, newImage) => {
    console.log(name, newImage)
    return User.findOneAndUpdate({name: name},
                {image : newImage})
                .exec()
}

module.exports.checkRequest = (owner,name) => {
    return User.findOne({name: owner, "requestsRcv.requester": name})
                .exec()
}

module.exports.insertRequest = (owner, request) => { 
    return User.findOneAndUpdate({name:  owner},
                    {$push: {requestsRcv: request}})
                    .exec()
}

module.exports.removeRequest = (owner, name) => { 
    return User.findOneAndUpdate({name:  owner},
                    {$pull: {requestsRcv: {requester: name}}})
                    .exec()
}
