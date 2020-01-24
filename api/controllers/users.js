var User = require('../models/user');

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

module.exports.insert = (user) => {
    console.dir(user)
    user = new User(user)
    return user.save()
}

module.exports.subscribe = (email, subscription) => {
    return User.findOneAndUpdate({email: email},
            {$push: {subscriptions: subscription}})
            .exec()
}

module.exports.unsubscribe = (email, subscription) => {
    return User.findOneAndUpdate({email: email},
            {$pull: {subscriptions: subscription}})
            .exec()
}

module.exports.insertMention = (name, postId) => {
    console.log(name, postId)
    return User.findOneAndUpdate({name: name},
                {$push: {mentions: postId}})
                .exec()
}
