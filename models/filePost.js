var Post = require('./post')

class FilePost extends Post{
    constructor(title, filePath){
        super(title)
        this.filePath = filePath
        this.description = null
        this.size = null
        this.name = null
        this.mimetype = null
    }


}