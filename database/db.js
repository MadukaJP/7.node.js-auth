const mongoose = require('mongoose')
const {MONGODB_URI} = require('../config')

let retryCount = 0
const MAX_RETRIES = 3;

const connectToDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        //reset retry count
        retryCount = 0;
        console.log('MongoDB connected successfully');
    } catch (error) {
        retryCount++
        console.error(error)
        console.error(`MongoDB connection failed (${retryCount}/${MAX_RETRIES})`);

        if (retryCount < MAX_RETRIES) {
            console.log("Retrying in 2 seconds...");
            setTimeout(connectToDB, 2000);
        } else {
            console.error("Max retries reached. Exiting...");
            process.exit(1)
        }
    }
}


module.exports = connectToDB;
