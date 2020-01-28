var apiReq = require('../utils/api');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuração da estratégia OAuth Google
const strategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.SERVER_URL + "/auth/google/callback"
}

const verifyCallback = async (accessToken, refreshToken, profile, done) => {

  const verifiedEmail = profile.emails.find(email => email.verified) || profile.emails[0]

  apiReq.get('/users/' + verifiedEmail.value)
  .then(dados => {
    var user = dados.data
    console.dir(user)
    if(!user) {
      console.log("Criar user")
      user = {        
        email: verifiedEmail,
        name: profile.displayName.replace(' ', ''),
        type: "google"
      }
      console.dir(user)
      apiReq.post('/users', user)
      .then(() => {
        return done(null, user)
      })
      .catch(erro => {
        return done(erro)
      })
    }
    else if(user.type == "google"){
      console.log('Autentificação feita com sucesso')
      return done(null, user);
    } else {
      console.log('Já existe conta a utilizar esse email')
      return done(null, false);
    }
  })
  .catch(erro => done(erro))
}

const strategy = new GoogleStrategy(strategyOptions, verifyCallback);

module.exports = { strategy }