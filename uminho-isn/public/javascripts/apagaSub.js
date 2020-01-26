function apagarSub(sub, name){
    console.log('Vou tentar apagar a sub ' + sub + ' do utilizador ' + name + ' ....')
    axios.delete('/subscription/' + name + '/tag/' + sub)
        .then(response => window.location.assign('/profile/'+ name))
        .catch(error => console.log(error))
}