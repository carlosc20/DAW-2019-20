
module.exports = {
    checkTags: function(reference, toCompare){
    let c = 0
    let found = 0
    for(var i = 0; i < reference.length; i++){
        if(!reference[i].public){
            c++
            for(var j = 0; j < toCompare.length; j++){
                if(reference[i].tag == toCompare[j].tag)
                    found++
            }
        }
    }
    return (c == found)
    }
}
