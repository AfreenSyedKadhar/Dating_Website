const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit to handle base64 image data

// Connect to MongoDB
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/datingApp';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection error:', err));

// Define a schema for user registration
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    maritalStatus: { type: String, required: true },
    gender: { type: String, required: true },
    lookingFor: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    profilePic: { type: String }, // Base64 encoded image
}, { timestamps: true });

// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Endpoint: Register user
app.post('/register', async (req, res) => {
    const {
        name,
        age,
        maritalStatus,
        gender,
        lookingFor,
        email,
        password,
        description,
        profilePic
    } = req.body;

    try {
        // Save user to the database
        const newUser = new User({
            name,
            age,
            maritalStatus,
            gender,
            lookingFor,
            email,
            password,
            description,
            profilePic,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists!' });
        } else {
            console.error('Error saving user:', error);
            res.status(500).json({ message: 'Failed to register user.' });
        }
    }
});

// Endpoint: Health check
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
