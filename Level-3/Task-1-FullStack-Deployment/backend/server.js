require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

/// --- MIDDLEWARE: PROTECT PRIVATE ROUTES ---
// This ensures only logged-in users with a valid token can access tasks
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user; // Contains the user ID from the login payload
        next();
    });
};

// --- 1. REGISTER ROUTE ---
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Fields required" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: "User registered!" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username taken" });
        res.status(500).json({ error: "Database error" });
    }
});

// --- 2. LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // Include the ID in the token so we know which tasks belong to this user later
        const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// --- 3. Task Routes (The "Application" Logic) ---
// GET: Fetch tasks only for the currently logged-in user
app.get('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows);
    }catch (err) {
        res.status(500).json({ error: "Could not fetch tasks" });
    }
});

// POST: Create a new task linked to the user
app.post('/api/tasks', authenticateToken, async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Task title is required" });

    try {
        await db.execute('INSERT INTO tasks (user_id, title) VALUES (?, ?)', [req.user.id, title]);
        res.status(201).json({ message: "Task created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to create task" });
    }
});

// DELETE: Remove a specific task
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    try {
        // Ensure the task actually belongs to the user before deleting
        const [result] = await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found or unauthorized" });
        
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`🚀 Level 3 Server running on port ${PORT}`));