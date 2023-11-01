const mongoose = require('mongoose');
const dotenv=require('dotenv')

dotenv.config()

mongoose.connect(process.env.PASS).then(() => {
    console.log('Server is connected Successfully');
})

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    date: { type: Date, default: Date.now },
})

let UserModel = mongoose.model('User', userSchema);


module.exports = UserModel;