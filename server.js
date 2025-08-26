// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000;

// Middleware to enable CORS and parse JSON request bodies
app.use(cors());
app.use(express.json());

// A simple in-memory "database" to store user data.
// In a real application, you would use a persistent database like MongoDB.
const users = [];

// Base API endpoint for user routes
const userRoutes = express.Router();

// --- API ENDPOINT: HOME ---
// Added a new GET route for the root URL to confirm the server is running.
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the LifeConnect Node.js API! The server is running.');
});


// --- API ENDPOINT: SIGN UP ---
// This endpoint handles new user registration.
userRoutes.post('/signup', (req, res) => {
    const { fullName, email, password, phone, dateOfBirth, bloodGroup, location, userType, organsDonate, medicalHistory, emergencyContact } = req.body;

    // Basic server-side validation
    if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Email, password, and full name are required.' });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'This email is already registered.' });
    }

    // Create a new user object with a simple unique ID
    const newUser = {
        id: Date.now().toString(), // A simple way to generate a unique ID
        fullName,
        email,
        password, // NOTE: In a real app, you MUST hash the password with a library like bcrypt.
        phone,
        dateOfBirth,
        bloodGroup,
        location,
        userType,
        organsDonate,
        medicalHistory,
        emergencyContact,
        createdAt: new Date()
    };

    // Add the new user to our "database"
    users.push(newUser);

    // Send a success response with the new user's profile data
    res.status(201).json({ message: 'Account created successfully!', user: newUser });
});

// --- API ENDPOINT: LOG IN ---
// This endpoint handles user authentication.
userRoutes.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user in our "database"
    const user = users.find(u => u.email === email);

    // Check if the user exists and the password is correct
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // NOTE: In a real app, you would compare the provided password
    // with the hashed password from the database.
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Send a success response with the user's profile data (excluding sensitive info like password)
    const { password: _, ...userProfile } = user;
    res.status(200).json({ message: 'Login successful!', user: userProfile });
});

// Use the user routes with a base path
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Node.js backend listening at http://localhost:${port}`);
    console.log('Endpoints:');
    console.log(`- GET /`);
    console.log(`- POST /api/users/signup`);
    console.log(`- POST /api/users/login`);
});
