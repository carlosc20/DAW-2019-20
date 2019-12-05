var User = require('../models/user');

module.exports.getAll = () =>
    User.find()
        .exec()

module.exports.get = email => 
    User.findOne({email: email})
        .exec()