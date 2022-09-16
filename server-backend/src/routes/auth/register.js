const axios = require('axios')
const graphqlENDPOINT = process.env.GRAPHQL_ENDPOINT;




module.exports = async (req, res) => {
    // If password and confirm password do not match, alert user of error
    if (req.body.password !== req.body.confirmPassword) {
        res.send({ error: "We're sorry, your passwords do NOT match. Please try again!" })
        return
    };

    try {
        // Create the GraphQL mutation
        // Email, Username, and Password set to String! format
        // Email, Username, and Password set to their $:string counterparts
        const mutation = `
        mutation register($email: String!, $username: String!, $password: String!) {
            register(email: $email, username: $username, password: $password)
        }
        `
        // Make a POST request to GraphQL with a request body with the query and variables from the request
        // User input of email, username, and password is retrieved as proper json type
        const { data } = await axios.post(graphqlENDPOINT,
            {
                query: mutation,
                variables: {
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        // Get the token from the user register response from GraphQL
        const jswToken = data.data.register;
        console.log(jswToken);
        // Add the cookie to the response
        res.cookie('jswToken', jswToken, { maxAge: 900000, httpOnly: true });
        // Redirect back to the dashboard
        res.redirect('/');

    } catch(error) {
        // If there is an issue with the registration, redirect user back to registration page
        console.log(error);
        res.redirect('');
    };
};