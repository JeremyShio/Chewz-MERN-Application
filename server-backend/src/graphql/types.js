const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType } = require('graphql');
const { User } = require('../models');




// GraphQL type for the User (to connect list of restaurants to the user)
const UserType = new GraphQLObjectType(
    {
        name: 'User',
        description: 'User type',
        fields: () => ({
            id: { type: GraphQLID },
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            Lists: {
                type: GraphQLList(ListType),
                resolve(parent, args){
                    return List.find({ userId: parent.id })
                }
            }
        })
    }
);


// List Type for the User to store interesting restaurants
const ListType = new GraphQLObjectType(
    {
        name: 'List',
        description: 'List type',
        fields: () => ({
            id: { type: GraphQLID },
            slug: { type: GraphQLString },
            title: { type: GraphQLString },
            description: { type: GraphQLString },
            userId: { type: GraphQLID },
            user: {
                type: UserType,
                resolve(parent, args){
                    return User.findById(parent.userId)
                }
            },
            notes: {
                type: GraphQLList(NoteType),
                resolve(parent, args){
                    return Note.find({ listId: parent.id })
                }
            }
        })
    }
);


// Create a Note Type (to be able to query)
const NoteType = new GraphQLObjectType(
    {
        name: 'Note',
        description: 'Note Type',
        fields: () => ({
            id: { type: GraphQLID },
            restaurant: { type: GraphQLString },
            person: { type: GraphQLString },
            order: { type: GraphQLInt },
            listId: { type: GraphQLID },
            comment: { type: GraphQLString },
            list: {
                type: ListType,
                resolve(parent, args){
                    return List.findById(parent.listId)
                }
            }
        })
    }
);


// Create a Note Input Type (for mutation of creating Lists of Restaurants)
const NoteInputType = new GraphQLInputObjectType(
    {
        name: 'NoteInput',
        description: 'Note Input Type',
        fields: () => ({
            restaurant: { type: GraphQLString },
            person: { type: GraphQLString },
            comment: { type: GraphQLString },
            order: { type: GraphQLInt }
        })
    }
);


module.exports = {
    UserType,
    ListType,
    NoteType,
    NoteInputType
};