var jwt = require('jsonwebtoken')

module.exports = {
    genToken : function(){
        return jwt.sign({}, "daw2019", 
          {
              expiresIn: 3000, 
              issuer: "Servidor myAgenda"
          })
      },

    getUrlWithToken: function(url){
        if(url.match(/.*[?].*/)){
            return url + '&token=' + this.genToken()
        }else{
            return url + '?token=' + this.genToken()
        }
    }
      
}