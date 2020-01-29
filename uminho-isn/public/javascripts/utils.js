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
    console.log(tag)
    axios.post('/subscription/public/' + tag)
        .then(dados => window.location.assign('/subscriptions'))
        .catch(error => {console.log(error)})
}

function subscribeRequest(tag){
    console.log(tag)
    axios.post('/subscription/request/' + tag) 
        .then(dados => window.location.assign('/subscriptions'))
        .catch(error => {console.log(error)})
}

function answerRequest(tag, requester, boolean){
    console.log(tag)
    console.log(requester)
    console.log(boolean)
    axios.post('/answer/' + boolean + '/request/' + tag + '/' + requester)
            .then(dados => window.location.assign('/subscriptions'))
            .catch(error => {console.log(error)})
}

