const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// This adds username, hash, salt fields + helper methods for auth
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
