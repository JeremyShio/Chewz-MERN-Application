const dotenv = require('dotenv');
const express = require('express');
// Create an 'express' server app
const app = express();
const PORT = process.env.PORT || 7777;
const initRoutes = require('./src/routes');
const path = require('path');
const { connectDataBase } = require('./src/db');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql/schema');
const cookieParser = require('cookie-parser');
const { authenticate } = require('./src/middleware/auth');
const { userData } = require('./src/middleware/userData');




// Loads the .env file into the process.env
dotenv.config();

// Connects to the database
connectDataBase();

// Add cookie-parser middleware to add cookie headers to the req.cookie
app.use(cookieParser());

// Add authentication middleware to the app
app.use(authenticate);

// Add userData middleware AFTER authentication middleware
app.use(userData);

// Add graphql to the express application
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true // Allows us to use the GraphiQL test tool
}));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Update the location of the views folder that res.render uses
app.set('views', path.join(__dirname, 'src/templates/views'));

// Need this middleware so that form data is added to request
app.use(express.urlencoded({ extended: true }));

// Initialize routes
initRoutes(app);

// The Node.js server is permitted to listen on the '7777' port
app.listen(PORT, () => {
    // 'nodemon server or start' in terminal to check that server is successfully running on the set port
    console.log(`Server is running on port: ${PORT}! -- [Server: ✓]`);
});