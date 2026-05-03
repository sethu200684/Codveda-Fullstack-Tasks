const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// In-memory data (used instead of a database for Level 1)
let users = [
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "Designer" }
];

// --- API ROUTES ---

// 1. READ: Get all users
app.get('/api/users', (req, res) => {
    res.status(200).json(users);
});

// 2. CREATE: Add a new user[cite: 1]
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        role: req.body.role
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// 3. UPDATE: Update a user's details
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    
    if (index !== -1) {
        users[index].name = req.body.name || users[index].name;
        users[index].role = req.body.role || users[index].role;
        res.status(200).json(users[index]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// 4. DELETE: Remove a user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.status(200).json({ message: `User with ID ${id} deleted` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Test it here: http://localhost:${PORT}/api/users`);
});