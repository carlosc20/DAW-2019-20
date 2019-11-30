var Post = require("./post")

class TextPost extends Post{
    constructor(title){
        super(title)
        this.text = null
    }

    setText(text){
        this.text = text
    }

    getText(){
        return this.text
    }
    

    toString(){
        var res = super.toString()
        res += "\ntexto: " + this.getText()
        return res
    }
}

module.exports = TextPost

console.log("TEXTPOST.JS DEBUGGING...")
var textPost = new TextPost("test title")
textPost.setText("Olá o meu nome é alibaba e gosto de ir ali babar-me ;)")
console.log(textPost.toString())