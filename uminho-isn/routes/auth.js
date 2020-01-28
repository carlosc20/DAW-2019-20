var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/google', 
  passport.authenticate('google', { 
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
      ]
  }
));

router.get('/google/callback',
  passport.authenticate('google', {  
    successRedirect: '/',
    failureRedirect: '/login'
  })
);


router.get('/facebook', passport.authenticate('facebook', {
  scope: [
    'email'
  ]}
));

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/login' 
  })
);


module.exports = router;
