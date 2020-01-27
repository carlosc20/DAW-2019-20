var apiReq = require('../utils/api');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

const strategy = new LocalStrategy(
    {usernameField: 'email'}, (email, password, done) => {
      apiReq.get('/users/' + email)
        .then(dados => {
          const user = dados.data
          console.dir(user)
          if(!user) {
            return done(null, false)
          }
          if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false)
          }
          console.log('Autentificação feita com sucesso')
          return done(null, user)
        })
        .catch(erro => done(erro))
  })

module.exports = { strategy }