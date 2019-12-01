class Comment{
    constructor(text, publisher){
        this.text = text
        this.subComments = new Array
        this.references = new Array
        this.publisher = publisher
    }

    addComment(comment){
        this.subComments.push(comment)
    }

    getCommentIndex(index){
        return this.subComments[index]
    }

    getPublisher(){
        return this.publisher
    }

    getText(){
        return this.text
    }

}