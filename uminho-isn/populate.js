const fs = require('fs')
const apiReq = require('./utils/api') 

getDirectories = source => 
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

getFiles = source => 
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)

hasFile = source => {
    return getFiles(source).length > 0
}

hasDirectories = source => {
    return getDirectories(source).length > 0
}

searchPost = (source, level)  =>{
    level = level || 0
    if(hasDirectories(source)){

    }else {

    }
    if(level > 3 && hasFile()){
        let title = ''
        let match = source.match(/(.+)\//)
        for(let i = match.length-1; i > 3; i++)
            title += match[i] + ' '
        let form = new FormData()
        form.append('title', req.body.title)
        form.append('description', req.body.description)
        if(req.files)
            req.files.forEach(file => {
            form.append('files' , file.buffer, file.originalname)
            })
        apiReq.post('/api/post', form, {
            headers: {
            'Content-Type': 'multipart/form-data; boundary='+form._boundary
            }
        })
    }
}

var knownTags = []
searchTags = (source, level) => {
    level = level || 0  
    getDirectories(source).forEach(element => {
        if(!knownTags.includes(element) && level < 4){
            knownTags.push(element)
            let tag = {tag: element, public: true}
            apiReq.post('/tags', tag)
            searchTags(source + '/' + element, level+1)
        }
    });
}


main = () => {
    let src = './'
    searchTags(src)
    console.log(getFiles(src + 'views'))
}

main();