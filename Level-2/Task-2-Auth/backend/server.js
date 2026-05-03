const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "codveda_secret_key";

// --- 1. REGISTER ROUTE (With Validation) ---
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // Data Validation
    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (username.length < 4) {
        return res.status(400).json({ error: "Username must be at least 4 characters long." });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save to MySQL
        await db.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        // Handle Duplicate Username Error (MySQL Error Code: ER_DUP_ENTRY)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "That username is already taken." });
        }
        console.error(err);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// --- 2. LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required." });
    }

    try {
        // Find user in database
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = rows[0];

        // Check if password matches the hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        
        res.json({ 
            message: "Login successful!", 
            token: token,
            username: user.username 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Auth Server running on http://localhost:${PORT}`));