const jwt = require('jsonwebtoken');
const decryptedToken = (token) => {

    if(token){
        const decrypt = jwt.verify(token, "12345");
        return decrypt;
    }
    throw new Error("Login required");       
};

module.exports = decryptedToken;