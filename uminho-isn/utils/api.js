var tokenGen = require('./token');
var axios = require('axios');
const apiHost = require('../config/env').API_HOST;

module.exports = {
    get: function(path){
        return axios.get(apiHost + path, tokenGen.getTokenConfig());
    },

    post: function(path, body, headers){
        if(!headers) headers = {'headers': {}}
        if(!body) body = {}
        headers.headers['Authorization'] = `Bearer ${tokenGen.genToken()}`;
        return axios.post(apiHost + path, body, headers);
    },

    delete: function(path){
        return axios.delete(apiHost + path, tokenGen.getTokenConfig());
    },

    put: function(path, body){
        return axios.put(apiHost + path, body, tokenGen.getTokenConfig());
    }
}