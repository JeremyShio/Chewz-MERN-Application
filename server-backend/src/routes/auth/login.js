const axios = require('axios');




module.exports = async (req, res) => {
    // If the email or password is blank, redirect user back to login
    if (!req.body.email || !req.body.password) {
        res.redirect('/auth/login');
        return
    };

    try {
        // Create the GraphQL mutation
        const mutation = `
        mutation login($email: String!, $password: String!) {
            login(email: $email, password: $password)
        }
        `
        // Make a POST request to GraphQL with a request body with the query and variable from the request
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query: mutation,
                variables: {
                    email: req.body.email,
                    password: req.body.password
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        // Get the token from the user login response from GraphQL
        const jswToken = data.data.login;
        // Add the cookie to the response
        res.cookie('jswToken', jswToken, { maxAge: 900000, httpOnly: true });
        // Redirect back to the dashboard
        res.redirect('/');

    } catch(error) {
        // If there is an issue, redirect back to login
        console.log(error);
        res.redirect('/auth/login');
    };
};
