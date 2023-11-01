
const mongoose = require("mongoose");

let Contactschema = new mongoose.Schema({
    name: String,
    email:String,
    phone: String,
    address: String,
    goal: String
});

const Contact = mongoose.model('Contact', Contactschema);

module.exports = Contact;