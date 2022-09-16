// Import Types from GraphQL
const { GraphQLList, GraphQLID, GraphQLString } = require('graphql');
// Import our own created types
const { UserType, ListType } = require('./types');
// Import model so we can get data from MongoDB
const { User, List } = require('../models');




// Query that will get all of the users from the database
const users = {
    type: new GraphQLList(UserType),
    description: "Query all users in the database",
    resolve(parent, args) {
        return User.find();
    }
};


// Query that will get a user by id - add id to args 
const user = {
    type: UserType,
    description: "Query user by id",
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args){
        return User.findById(args.id);
    }
};


// Query that will get a list by the slug - add slug to args
const listBySlug = {
    type: ListType,
    description: 'Query list by its slug',
    args: {
        slug: { type: GraphQLString }
    },
    resolve(parent, args) {
        return List.findOne({ slug: args.slug });
    }
};


module.exports = {
    users,
    user,
    listBySlug
};