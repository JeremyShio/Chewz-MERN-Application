const mongoose = require('mongoose');




// Connect with the 'MongoDB Atlas' using 'mongoose' library and the MONGO_URI
const connectDataBase = async () => {
    // If the connection gets established
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB database connection successfully established! -- [DataBase: ✓]');
}


module.exports = { connectDataBase }