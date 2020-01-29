
module.exports = {
    checkTags: function(reference, toCompare){
    let c = 0
    let found = 0
    for(var i = 0; i < reference.length; i++){
        if(reference[i] && !reference[i].public){
            c++
            console.log("ola1")
            for(var j = 0; j < toCompare.length; j++){
                if(reference[i] && toCompare[j] && reference[i].tag ==  toCompare[j].tag)
                    found++
            }
        }
    }
    return (c == found)
    }
}
