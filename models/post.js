var mongoose = require('mongoose')
const Schema = mongoose.Schema
class Post {
    constructor({title, hashTags, comments}){
        this.title = title
        this.hashTags = hashTags
        this.comments = comments
    }

    constructor(title){
        this.title = title;
        this.hashTags = new Set();
        this._id = null
        this.comments = new Array;
    }    

    addHashTag(tag){
        return this.hashTags.add(tag)
    }

    removeHashTag(tag){
        return this.hashTags.delete(tag)
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
        console.log(this)
        var post =  new Post.model(this)
        console.log(post)
        return post.save()
    }
}

Post.Schema = new Schema({
    title: String,
    hashTags: Array,
    comments: Array
})

Post.model = mongoose.model('posts', Post.Schema)

module.exports = Post

/*
console.log("POST.JS DEBUGGING...")
var post = new Post("Test title")
post.addHashTag("IAmaTag")
post.addHashTag("AnotherTag")
console.log(post.toString());
*/