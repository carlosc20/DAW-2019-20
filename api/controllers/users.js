var User = require('../models/user');

module.exports.getAll = () => {
    return User.find()
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