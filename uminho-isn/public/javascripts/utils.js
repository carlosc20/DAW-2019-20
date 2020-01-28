$.fn.selectpicker.Constructor.BootstrapVersion = '4'

function apagarSub(sub, email){
    console.log('Vou tentar apagar a sub ' + sub + ' do utilizador ' + email + ' ....')
    axios.delete('/subscription/' + email + '/tag/' + sub)
        .then(response => window.location.assign('/profile/'+ email))
        .catch(error => console.log(error))
}

function upVoteComment(idPost, idComment, email){
    axios.post('/comment/upvote/' + idComment + '/' + email)
        .then(dados =>  window.location.assign('/post/' + idPost))
        .catch(error => {console.log(error)})
}

function downVoteComment(idPost, idComment, email){
    axios.post('/comment/downvote/' + idComment + '/' + email)
        .then(dados =>  window.location.assign('/post/' + idPost))
        .catch(error => {console.log(error)})
}

function upVotePost(idPost, email){
    axios.post('/post/upvote/' + idPost + '/' + email)
        .then(dados => {
            window.location.assign('/post/' + idPost)
        })
        .catch(error => {console.log(error)})
}

function downVotePost(idPost, email){
    axios.post('/post/downvote/' + idPost + '/' + email)
        .then(dados =>  window.location.assign('/post/' + idPost))
        .catch(error => {console.log(error)})
}

function subscribe(tag){
    axios.post('/subscribe/public/' + tag)
        .then(dados => window.location.assign('/subscriptions'))
        .catch(error => {console.log(error)})
}

function subscribeRequest(tag){
    axios.post('/subscribe/request/' + tag)
        .then(dados => window.location.assign('/subscriptions'))
        .catch(error => {console.log(error)})
}
