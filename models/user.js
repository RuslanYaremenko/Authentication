const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/nodeauth')

const db = mongoose.connection

//User Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
})

const User = module.exports = mongoose.model('User', UserSchema)
module.exports.createUser = (newUser, cb) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash
            newUser.save(cb)
        });
    });
}