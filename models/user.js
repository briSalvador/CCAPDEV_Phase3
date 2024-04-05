const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        description: {type: String, default: "Empty Description"},
        role: {type: String, required: true},
        email: {type: String, required: true},
    }
)

const user = mongoose.model("User", userSchema);
module.exports = user