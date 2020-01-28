var apiReq = require('../utils/api');
var FacebookStrategy = require('passport-facebook').Strategy;


const strategyOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.SERVER_URL + "/auth/facebook/callback",
  profileFields: ['displayName','email']
}

const verifyCallback = async (accessToken, refreshToken, profile, done) => {

    console.log(profile.displayName)
    console.log(profile.emails)
  const verifiedEmail = profile.emails.find(email => email.verified) || profile.emails[0]
    // photos[aa].value


  apiReq.get('/users/' + verifiedEmail.value)
  .then(dados => {
    var user = dados.data
    console.dir(user)
    if(!user) {
      console.log("Facebook: sucesso -> primeiro login, vai criar user")
      user = {        
        email: verifiedEmail.value,
        name: profile.displayName,
        type: "facebook",
      }
      console.dir(user)
      apiReq.post('/users', user)
      .then(() => {
          console.log("Facebook: utilizador criado")
        return done(null, user)
      })
      .catch(erro => {
        console.log("Facebook: post utilizador falhou")
        return done(erro)
      })
    }
    else if(user.type == "facebook"){
      console.log('Facebook: sucesso -> conta correspondente já existe')
      return done(null, user);
    } else {
      console.log('Facebook: erro -> Já existe conta a utilizar esse email')
      return done(null, false);
    }
  })
  .catch(erro => done(erro))
}

const strategy = new FacebookStrategy(strategyOptions, verifyCallback);

module.exports = { strategy }