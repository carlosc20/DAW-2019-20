var Identifier = require('../models/identifier');

module.exports.getAll = () => {
    return Identifier.find()
                    .exec()
}

module.exports.get = tag => {
    console.log(tag)
    return Identifier.findOne({tag: tag})
                    .exec()
}

module.exports.insert = identifier =>{
    identifier = new Identifier(identifier)
    return identifier.save()
}