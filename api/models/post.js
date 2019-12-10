var mongoose = require('mongoose')

class Post {
    constructor(title){
        this.title = title;
        this.date = new Date().toISOString();
        this.tags = new Array;
        this._id = null
        this.comments = new Array;
    }    

    addHashTag(tag){
        this.tags.push('#'+tag)
    }

    removeHashTagIndex(tag){
        this.tags.splice(index, 1)
    }

    addComment(comment){
        this.comments.push(comment)
    }

    removeCommentIndex(index){
        this.comments.splice(index, 1)
    }

    setId(id){
        this.id = id
    }

    getId(){
        return this.id
    }

    save(){
        if(this.tags.length == 0){
            this.addHashTag('public');
        }
        console.log(this)
        var post =  new Post.model(this)
        console.log(post)
        return post.save()
    }
}

var fileSchema = new mongoose.Schema({
    name: String,
    mimetype: String,
    size: Number
})

Post.Schema = new mongoose.Schema({
    title: String,
    poster: String,
    date: String,
    tags: Array,
    files: [fileSchema],
    comments: Array
    // likes/dislikes, updates/edits   
})

Post.model = mongoose.model('post', Post.Schema);

module.exports = Post;


console.log("POST.JS DEBUGGING...")
var post = new Post("Test title")
post.addHashTag("IAmaTag")
post.addHashTag("AnotherTag")

console.dir(post);