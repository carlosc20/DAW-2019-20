var User = require('../models/user');

module.exports.list = () => {
    return User
        .find()
        .exec()
}