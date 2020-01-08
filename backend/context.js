const decryptedToken = require('./jwtDecoder');
const neo4j = require('neo4j-driver');

function getContext(req){
    const neoDriver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'password')
    );
    if (typeof req == "undefined" ) return {neoDriver};
    const authHeader = req.get('Authorization');
    if (typeof authHeader == "undefined" || authHeader === "") return {neoDriver};
    const token = authHeader.replace('Bearer ', '');
    const decrypted = decryptedToken(token);
  
    let user  = users.find(
      userx => userx.username === decrypted.username );
  
    if(user === undefined){
      return {neoDriver};
    }
    return {user,neoDriver};
  }

module.exports = getContext;