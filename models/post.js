class Post {
    constructor(title){
        this.title = title;
        this.hashTags = new Set();
        this.id = null
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
}

module.exports = Post

/*
console.log("POST.JS DEBUGGING...")
var post = new Post("Test title")
post.addHashTag("IAmaTag")
post.addHashTag("AnotherTag")
console.log(post.toString());
*/