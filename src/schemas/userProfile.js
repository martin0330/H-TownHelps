const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: String,
});

module.exports = model('User', userSchema, 'users');
