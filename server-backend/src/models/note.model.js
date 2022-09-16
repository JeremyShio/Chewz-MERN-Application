const mongoose = require('mongoose');




const noteSchema = new mongoose.Schema(
    {
        restaurant: {
            type: String,
            required: true
        },
        person: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        },
        listId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("note", noteSchema);