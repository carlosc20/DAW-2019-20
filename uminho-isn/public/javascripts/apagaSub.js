function apagarSub(sub, email){
    console.log('Vou tentar apagar a sub ' + sub + ' do utilizador ' + email + ' ....')
    axios.delete('/subscription/' + email + '/tag/' + sub)
        .then(response => window.location.assign('/profile/'+ email))
        .catch(error => console.log(error))
}