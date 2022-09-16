const jsonWT = require('jsonwebtoken');




// Function which takes in the user and assigns a jsonwebtoken to their account
const createJsonWebToken = (user) => {
    // Create a token with the user object and secret key
    return jsonWT.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};


module.exports = { createJsonWebToken };