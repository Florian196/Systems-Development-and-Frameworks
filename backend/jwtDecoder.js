const jwt = require('jsonwebtoken');
const decryptedToken = (token, requireAuth = true) => {

    if(token){
        const decrypt = jwt.verify(token, "12345");
        return decrypt;
    }

    if(requireAuth){
        throw new Error("Login required");
        
    }
    return null;
};

module.exports = { decryptedToken }