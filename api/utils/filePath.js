var crypto = require('crypto');

module.exports = {
    getFile: function (idPost, filename ){
        return this.getFilePath(idPost, filename) + '/' + filename
    },

    getFilePath : function(idPost, filename){
        return __dirname + '/../public/ficheiros' + this.getLocalPath(idPost, filename);
    },

    getLocalPath: function(idPost, filename){
        let hash = crypto.createHash('md5')
        .update(idPost + filename)
        .digest('hex');
        let localPath = ""
        for(let i = 0; i < 4; i++){
            localPath += '/' + hash.slice(i * 8 + i, i*8 + i + 8)
        }
        return localPath;
    }
}