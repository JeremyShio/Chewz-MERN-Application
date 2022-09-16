const { GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const { User, List, Note } = require('../models');
const { createJsonWebToken } = require('../util/auth');
const bcrypt = require('bcrypt');
const { NoteInputType } = require('./types');




const register = {
    type: GraphQLString,
    description: 'Register a new user with You Chewz',
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args) {
        const checkUser = await User.findOne({ email: args.email });
        if (checkUser) {
            throw new Error("We're sorry, a user with this email address already exists.");
        };

        const { username, email, password } = args;

        // Hash password before creating
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: passwordHash });

        await user.save();

        const jwToken = createJsonWebToken(user);

        return jwToken;
    }
};


const login = {
    type: GraphQLString,
    description: 'Log a user in with their email and password',
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        const correctPassword = await bcrypt.compare(args.password, user?.password || '');
        if (!user || !correctPassword) {
            throw new Error('Invalid Credentials');
        };

        const jwToken = createJsonWebToken(user);

        return jwToken;
    }
};


const createList = {
    type: GraphQLString,
    args: {
        notes: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NoteInputType)))
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        userId: {
            type: GraphQLID
        }
    },
    async resolve(parent, args) {
        // Generate a slug for our list
        let slugify = args.title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
        let fullSlug = '';
        /*
        Add a random integer to the end of the slug, check that the slug doesn't already exist
        If it does, generate a new slug
        */
        while (true) {
            let slugId = Math.floor(Math.random() * 10000);
            fullSlug = `${slugify}-${slugId}`;

            const existingList = await List.findOne({ slug: fullSlug });

            if (!existingList) {
                break;
            };
        };

        const list = new List({
            title: args.title,
            slug: fullSlug,
            description: args.description,
            userId: args.userId
        });

        await list.save();

        // Create note type and connect to new list
        for (let note of args.notes) {
            const newNote = new Note({
                restaurant: note.restaurant,
                person: note.person,
                comment: note.comment,
                order: Number(note.order),
                listId: list.id
            });
            newNote.save();
        };

        return list.slug;
    }
};




module.exports = { register, login, createList };