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

  const verifiedEmail = profile.emails.find(email => email.verified) || profile.emails[0]

  apiReq.get('/users/' + verifiedEmail)
  .then(dados => {
    const user = dados.data
    console.dir(user)
    if(!user) {
      user = {
        name: profile.displayName,
        email: verifiedEmail,
        profile: profile,
        type: "google"
      }
      apiReq.post('/users', user)
      return done(null, user);
    }
    console.log('Autentificação feita com sucesso')
    return done(null, user);
  })
  .catch(erro => done(erro))
}

const strategy = new GoogleStrategy(strategyOptions, verifyCallback);

module.exports = { strategy }