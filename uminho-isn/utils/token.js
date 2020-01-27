var jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/env').JWT_SECRET;

module.exports = {
    genToken: function(){
        return jwt.sign({}, JWT_SECRET, 
          {
              expiresIn: 3000, 
              issuer: "usn"
          })
      },

    getUrlWithToken: function(url){
        if(url.match(/.*[?].*/)){
            return url + '&token=' + this.genToken()
        }else{
            return url + '?token=' + this.genToken()
        }
    },
      
    getTokenConfig: function(){ 
        return {headers: { Authorization: `Bearer ${this.genToken()}` }};
    }
}