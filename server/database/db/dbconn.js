const mongoose = require('mongoose');


const connectdb = async () =>{

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useUnifiedTopology: true
        });

        console.log(`Database Connected to : ${conn.connection.host}`);
    } catch (error) {
        console.log(`db error : ${error.message}`);
    }
}

module.exports = connectdb;