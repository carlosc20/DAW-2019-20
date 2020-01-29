const fs = require('fs')
const apiReq = require('./utils/api') 
const axios = require('axios')
const FormData = require('form-data');
const rGen= require('./descriptions')

const dotenv = require('dotenv');


dotenv.config();

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

var numPosts = 0
searchPost = (source, users, level, tags)  =>{
    if(numPosts > 150) return
    if(hasDirectories(source)){
        getDirectories(source).forEach(elementDirectory => {
            let tags2 = tags.slice()
            if(level < 4)
                tags2.push(elementDirectory)
            searchPost(source + '/' + elementDirectory, users, level + 1, tags2)
        })
    }
    console.log(tags)
    if(level >= 3 && hasFile(source)){
        let title = ''
        let match = source.split('/')
        for(let i = match.length-1; !tags.includes(match[i]); i-- )
            title += match[i] + ' '
        let form = new FormData()
        let description = rGen.getRandomDescription()
        form.append('title', title)
        form.append('description', description)
        let userIndex = Math.floor(Math.random()*(users.length-1))
        form.append('poster', users[userIndex].name) 
        tags.forEach(elementTag => {
            form.append('tags', elementTag)
        })
        getFiles(source).forEach(elementFile => {
            let data = fs.readFileSync(source + '/' + elementFile)
            form.append('files', data , elementFile)
        })
        console.log(numPosts + '; src: ' +  source + ';tags: '  + tags)
        console.log("   At: " + source)
        numPosts++

        if(numPosts > 0 && numPosts <= 150 ){
            apiReq.post('/api/post', form, {
                headers: {
                'Content-Type': 'multipart/form-data; boundary='+form._boundary
                }
            }).then({})
            .catch(e => {console.log(e.message); process.exit()})
        } 
    }
}

generateUpDownVotes = (post, users) => {
    console.dir(post)
    let randLength = Math.floor(Math.random()*users.length)
    for(let i = 0; i < randLength; i++){
        let rand = Math.random()
        if(rand < 0.1){
            apiReq.post('/api/post/downvote/' + post._id + '/' + users[i].email)
                .then(_ => console.log("    " + post._id + " : Downvote from " + users[i].name))
                .catch(e => console.log(e.message))
        }
        if(rand < 0.5){
            apiReq.post('/api/post/upvote/' + post._id + '/' + users[i].email)
                .then(_ => console.log("    " + post._id + " : Upvote from " + users[i].name))
                .catch(e => console.log(e.message))
        }
    }
}

var numPostComment = 0
generateComments = (post, users) => {
    let randLength = Math.ceil(Math.random()*users.length/10)
    for(let i = 0; i < randLength; i++){
        let comment =  {
            text : rGen.getRandomDescription(),
            owner : users[i]
        }
        apiReq.post('/comment/' + post._id, comment).then(comm => {
            console.log( numPostComment + " Comment added ")
            numPostComment++
            let randVoteLength = Math.ceil(Math.random()*users.length/50)
            for(let j = 0; j < randVoteLength; j++){
                let userIndex = Math.floor(Math.random()*users.length-1)
                let vote = Math.random()
                if(vote < 0.5){
                    apiReq.post('/comment/upvote/' + comm.data._id  +'/' + users[userIndex].email)
                        .then(_ => console.log("comment " + comm.data._id + " has been upvoted by " + users[userIndex].name))
                        .catch(e => console.log(e.message))
                }else if(vote < 0.7){
                    apiReq.post('/comment/downvote/' + comm.data._id  +'/' + users[userIndex].email)
                        .then(_ => console.log("comment " + comm.data._id + " has been downvoted by " + users[userIndex].name))
                        .catch(e => console.log(e.message))
                }
            }
        })
        .catch(e => console.log(e.message))
    }
}


var knownTags = []
var numTag = 0
searchTags = (source, level) => {
    level = level || 0  
    getDirectories(source).forEach(element => {
        if(!knownTags.includes(element) && level < 4){
            knownTags.push(element)
            let tag = {tag: element, public: true}
            apiReq.post('/tags', tag)
            console.log(numTag + " " + tag.tag + " has been added")
            numTag++
            searchTags(source + '/' + element, level+1)
        }
    });
}

var numUsers = 0
populateUsers = () => {
    let users = rGen.getUsers()
    console.log("Expecting :" + (users.length-1) + " users")
    users.forEach(user => {
        apiReq.post('/users', user).then(_ => {
            console.log(numUsers + ' "' + user.name + '" added')
            numUsers++
        }).catch(e => console.log(e.message))
    })
}


main = () => { 
    let src = 'C:/Users/CésarAugustodaCostaB/Dropbox/dropbox MIEI'
    //searchTags(src) //1
    //populateUsers() //2
   /* apiReq.get('/users') //3
        .then(users => {
            searchPost(src, users.data, 0, [])
        })
        .catch(e => console.log(e.message))*/
    /*apiReq.get('/users') //4
        .then(users => {
            apiReq.get('/api/posts')
                .then(posts => {
                    posts.data.forEach(post => {
                        generateUpDownVotes(post, users.data)
                    })
                })
                .catch(e => console.log(e.message)) 
        })
        .catch(e => console.log(e.message)) */
    apiReq.get('/users') //4
        .then(users => {
            apiReq.get('/api/posts')
                .then(posts => {
                    posts.data.forEach(post => {
                        generateComments(post, users.data)
                    })
                })
                .catch(e => console.log(e.message)) 
        })
        .catch(e => console.log(e.message))
}
main();