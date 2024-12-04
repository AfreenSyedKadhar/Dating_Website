const mongoose = require('mongoose');

// Define a schema for user registration
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    maritalStatus: { type: String, required: true },
    gender: { type: String, required: true },
    lookingFor: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String },
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
