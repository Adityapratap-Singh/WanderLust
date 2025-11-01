const mongodb = require('mongoose');
const Schema = mongodb.Schema;
const plr = require('passport-local-mongoose');


const UserSchema = new Schema({
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
UserSchema.plugin(plr);
module.exports = mongodb.model('User', UserSchema);