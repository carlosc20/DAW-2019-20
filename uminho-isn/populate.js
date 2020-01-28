const fs = require('fs')
const apiReq = require('./utils/api') 
const axios = require('axios')
const FormData = require('form-data');

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

getRandomDescription = () => {
    return axios.get('https://baconipsum.com/api/?type=all-meat&sentences=1')
                .then(dados => {return dados.data[0]})
                .catch(e => console.log(e))
}

var numPosts = 0
searchPost = (source, level, tags)  =>{
    if(numPosts > 1) return
    level = level || 0
    tags = tags || new Array
    if(hasDirectories(source)){
        getDirectories(source).forEach(elementDirectory => {
            let tags2 = tags.slice()
            tags2.push(elementDirectory)
            searchPost(source + '/' + elementDirectory, level + 1, tags2)
        })
    }
    if(level > 3 && hasFile(source)){
        let title = ''
        let match = source.match(/(.+)\//)
        for(let i = match.length-1; i > 3; i-- )
            title += match[i] + ' '
        let form = new FormData()
        getRandomDescription().then(description => {
            form.append('title', title)
            form.append('description', description)
            form.append('poster', 'test') // alterar
            tags.forEach(elementTag => {
                form.append('tags', {tag: elementTag, public: true})
            })
            getFiles(source).forEach(elementFile => {
                fs.readFile(source + '/' + elementFile, (err, data) => {
                    if(err) throw err
                    else  form.append('files', data , elementFile)
                })
            })
            console.log(numPosts + '; src: ' +  source + ';tags: '  + tags)
            numPosts++

            apiReq.post('/api/post', form, {
                headers: {
                'Content-Type': 'multipart/form-data; boundary='+form._boundary
                }
            })
            .catch(e => {console.log(e); process.exit()})
        })
        .catch(e => {console.log(e), process.exit()})
        
        /*apiReq.post('/api/post', form, {
            headers: {
            'Content-Type': 'multipart/form-data; boundary='+form._boundary
            }
        })
        .catch(e => {console.log(e); process.exit()})*/
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
    let src = 'C:/Users/CésarAugustodaCostaB/Dropbox/dropbox MIEI'
    //searchTags(src)
    //console.log(getFiles(src))
    //console.log(getDirectories(src))
    searchPost(src)
}

main();