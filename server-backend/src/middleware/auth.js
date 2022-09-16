const jsonWT = require('jsonwebtoken');
// const TOKEN_SECRET = process.env.JWT_SECRET;
const unprotectedRoutes = [
    '/auth/login',
    '/auth/register',
    '/graphql'
];




const authenticate = async (req, res, next) => {
    // Get the token from the cookie on the request
    const token = req.cookies?.jswToken || '';

    try {
        // Try to verify the token
        const verified = jsonWT.verify(token, process.env.JWT_SECRET);
        // If the token is verified, add a verifiedUser property on req
        req.verifiedUser = verified;
        console.log('User verification successful, very nice!', verified);
        // Go to the next function 
        next();

    } catch(error) {
        // If the token doesn't verify it causes an error
        console.log('User verification failed, oh no!');
        // Check if the request is for a path that doesn't need a token
        if (unprotectedRoutes.includes(req.path)) {
            next();
            
        } else {
            // If path needs a token, redirect to login
            res.redirect('/auth/login');
        }
    }
};


module.exports = { authenticate };