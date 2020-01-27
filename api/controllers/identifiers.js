var Identifier = require('../models/identifier');

module.exports.getAll = () => {
    return Identifier.find()
               .exec()
}

module.exports.find = tag => {
    return Identifier.find({"identifier.tag": tag})
                    .exec()
}

module.exports.insert = identifier =>{
    identifier = new Identifier(identifier)
    return identifier.save()
}