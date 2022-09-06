const mongoose = require('mongoose');

const userCollection = 'usuarios';

const UserSchema = new mongoose.Schema({
    mail: {type: String, require: true, max: 50},
    pass: {type: String, require: true, max: 50},
})

const users = mongoose.model(userCollection, UserSchema);

module.exports = users;