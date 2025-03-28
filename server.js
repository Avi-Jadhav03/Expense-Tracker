const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const USERS_FILE = 'users.json';

app.use(cors());
app.use(bodyParser.json());

// Ensure the users.json file exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf8'); // Create an empty JSON array if file is missing
}

// Read users from JSON file safely
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users.json:", error);
        return [];
    }
};

// Write users to JSON file safely
const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        console.log("✅ User data successfully written to file!");
    } catch (error) {
        console.error("❌ Error writing to users.json:", error);
    }
};

// ✅ Signup Route (Registers a new user)
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    let users = readUsers();

    // Check if username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists!' });
    }

    users.push({ username, password }); // Storing password as plain text
    writeUsers(users);

    // ✅ Only send success message (no redirect needed in the response)
    res.status(201).json({ message: 'Signup successful! Redirecting to login page...' });
});


// ✅ Login Route (Authenticates user)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let users = readUsers();

    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }

    console.log(`✅ User logged in: ${username}`);

    res.status(200).json({ message: 'Login successful!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
