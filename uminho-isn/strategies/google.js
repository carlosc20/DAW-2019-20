var env = require('../config/env');
var apiReq = require('../utils/api');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuração da estratégia OAuth Google
const strategyOptions = {
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.SERVER_URL + "/auth/google/callback"
}

const verifyCallback = async (accessToken, refreshToken, profile, done) => {

  console.dir("Profile->" + profile)
  const verifiedEmail = profile.emails.find(email => email.verified) || profile.emails[0]

  apiReq.get('/users/' + verifiedEmail.value)
  .then(dados => {
    const user = dados.data
    console.dir(user)
    if(!user) {
      console.log("Criar user")
      user = {        
        email: verifiedEmail,
        name: profile.displayName,
        type: "google"
      }
      console.dir(user)
      apiReq.post('/users', user)
      return done(null, user);
    }
    if(user.type == "google"){
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