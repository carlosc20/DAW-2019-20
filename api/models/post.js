var mongoose = require('mongoose')
const Schema = mongoose.Schema
class Post {
    constructor(title){
        this.title = title;
        this.date = new Date().toISOString();
        this.hashTags = new Array;
        this._id = null
        this.comments = new Array;
    }    

    addHashTag(tag){
        this.hashTags.push('#'+tag)
    }

    removeHashTagIndex(tag){
        this.hashTags.splice(index, 1)
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

    toString(){
        var res = "title: " + this.title + "\nhashtags : ";
        console.log(this.hashTags)
        if(this.hashTags.size > 0){
            for(var tag of this.hashTags)
                res += tag + "; "
        }else res += "none"
        return res
    } 

    save(){
        if(this.hashTags.length == 0){
            this.addHashTag('public');
        }
        console.log(this)
        var post =  new Post.model(this)
        console.log(post)
        return post.save()
    }
}

Post.Schema = new Schema({
    title: String,
    date : String,
    hashTags: Array,
    comments: Array
})

Post.model = mongoose.model('posts', Post.Schema)

module.exports = Post


console.log("POST.JS DEBUGGING...")
var post = new Post("Test title")
post.addHashTag("IAmaTag")
post.addHashTag("AnotherTag")
console.log(post.toString());
