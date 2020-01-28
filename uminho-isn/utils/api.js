var axios = require('axios');
var request = require('request');
var jwt = require('jsonwebtoken');


genToken = function(){
    return jwt.sign({}, process.env.JWT_SECRET, 
        {
            expiresIn: 3000, 
            issuer: "usn"
        })
    }

 
getTokenConfig = function(){ 
    return {headers: { Authorization: `Bearer ${genToken()}` }};
}

module.exports = {
    get: function(path){
        return axios.get(process.env.API_HOST + path, {headers: { Authorization: `Bearer ${genToken()}` }});
    },

    post: function(path, body, headers){
        if(!headers) headers = {'headers': {}}
        if(!body) body = {}
        headers.headers['Authorization'] = `Bearer ${genToken()}`;
        console.log(headers)
        return axios.post(process.env.API_HOST + path, body, headers);
    },

    delete: function(path){
        return axios.delete(process.env.API_HOST + path, {headers: { Authorization: `Bearer ${genToken()}` }});
    },

    put: function(path, body){
        return axios.put(process.env.API_HOST + path, body, {headers: { Authorization: `Bearer ${genToken()}` }});
    },

    get_bin: function(path){
        let options = {
            url: process.env.API_HOST + path,
            headers: {
              'User-Agent': 'request',
              'Authorization' : `Bearer ${genToken()}` 
            }
        };
        return request.get(options)
    }
}