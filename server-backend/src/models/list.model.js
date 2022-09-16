const mongoose = require('mongoose');




const listSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            unique: true,
            required: true
        },
        title : {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("list", listSchema);