const mongoose = require('mongoose');

module.exports.connect = async ()=>{
    try {
        const mongooseUrl = process.env.MONGO_URI;
        await mongoose.connect(mongooseUrl);
        console.log("Connect Success!")
    } catch (error) {
        console.log(error);
        console.log("Connect Error!")
    }
}

