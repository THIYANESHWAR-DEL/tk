const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 3000;

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Root@123', // Update with your MySQL password
    database: 'tk_office_manager',
    charset: 'utf8mb4'
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve from frontend directory
app.use(express.static(path.join(__dirname, '../'))); // Also serve from project root for test files

// Database connection pool
let pool;

// Initialize database connection
async function initDatabase() {
    try {
        pool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        
        console.log('Connected to MySQL database');
        
        // Test connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        
    } catch (error) {
        console.error('Database connection failed:', error);
        console.log('Please ensure MySQL is running and database is created using database.sql');
        process.exit(1);
    }
}

// Helper functions
async function executeQuery(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Query execution error:', error);
        throw error;
    }
}

// Generate unique ID
function generateId() {
    return 'ID' + Date.now().toString() + Math.random().toString(36).substring(2, 8);
}

// API Routes

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const [clients, works, fees, expenses, files] = await Promise.all([
            executeQuery('SELECT * FROM clients ORDER BY created_at DESC'),
            executeQuery('SELECT * FROM works ORDER BY created_at DESC'),
            executeQuery('SELECT * FROM fees ORDER BY created_at DESC'),
            executeQuery('SELECT * FROM expenses ORDER BY created_at DESC'),
            executeQuery('SELECT * FROM files ORDER BY created_at DESC')
        ]);

        res.json({
            clients,
            works,
            fees,
            expenses,
            files
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clients
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await executeQuery('SELECT * FROM clients ORDER BY name');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clients', async (req, res) => {
    try {
        const { name, phone, email, address, gst } = req.body;
        const id = generateId();
        
        const sql = `INSERT INTO clients (id, name, phone, email, address, gst) 
                    VALUES (?, ?, ?, ?, ?, ?)`;
        
        await executeQuery(sql, [id, name, phone, email, address, gst]);
        
        const newClient = await executeQuery('SELECT * FROM clients WHERE id = ?', [id]);
        res.json({ success: true, client: newClient[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, address, gst } = req.body;
        
        const sql = `UPDATE clients SET name = ?, phone = ?, email = ?, address = ?, gst = ? 
                    WHERE id = ?`;
        
        await executeQuery(sql, [name, phone, email, address, gst, id]);
        
        const updatedClient = await executeQuery('SELECT * FROM clients WHERE id = ?', [id]);
        res.json({ success: true, client: updatedClient[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery('DELETE FROM clients WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Works
app.get('/api/works', async (req, res) => {
    try {
        const works = await executeQuery('SELECT * FROM works ORDER BY created_at DESC');
        res.json(works);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/works', async (req, res) => {
    try {
        console.log('POST /api/works request body:', req.body);
        const { client, title, type, status, deadline, notes } = req.body;
        const id = generateId();
        
        const sql = `INSERT INTO works (id, client, title, type, status, deadline, notes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        console.log('Executing SQL:', sql);
        console.log('Parameters:', [id, client, title, type, status, deadline, notes]);
        
        await executeQuery(sql, [id, client, title, type, status, deadline, notes]);
        
        const newWork = await executeQuery('SELECT * FROM works WHERE id = ?', [id]);
        console.log('Work added successfully:', newWork[0]);
        res.json({ success: true, work: newWork[0] });
    } catch (error) {
        console.error('Error adding work:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/works/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('PUT /api/works/' + id + ' request body:', req.body);
        const { client, title, type, status, deadline, notes } = req.body;
        
        const sql = `UPDATE works SET client = ?, title = ?, type = ?, status = ?, 
                    deadline = ?, notes = ? WHERE id = ?`;
        
        console.log('Executing UPDATE SQL:', sql);
        console.log('Parameters:', [client, title, type, status, deadline, notes, id]);
        
        await executeQuery(sql, [client, title, type, status, deadline, notes, id]);
        
        const updatedWork = await executeQuery('SELECT * FROM works WHERE id = ?', [id]);
        console.log('Work updated successfully:', updatedWork[0]);
        res.json({ success: true, work: updatedWork[0] });
    } catch (error) {
        console.error('Error updating work:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/works/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery('DELETE FROM works WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fees
app.get('/api/fees', async (req, res) => {
    try {
        const fees = await executeQuery('SELECT * FROM fees ORDER BY fee_date DESC');
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/fees', async (req, res) => {
    try {
        const { client, amount, worktype, fee_date, note } = req.body;
        const id = generateId();
        
        const sql = `INSERT INTO fees (id, client, amount, worktype, fee_date, note) 
                    VALUES (?, ?, ?, ?, ?, ?)`;
        
        await executeQuery(sql, [id, client, amount, worktype, fee_date, note]);
        
        const newFee = await executeQuery('SELECT * FROM fees WHERE id = ?', [id]);
        res.json({ success: true, fee: newFee[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/fees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery('DELETE FROM fees WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await executeQuery('SELECT * FROM expenses ORDER BY expense_date DESC');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const { category, amount, expense_date, note } = req.body;
        const id = generateId();
        
        const sql = `INSERT INTO expenses (id, category, amount, expense_date, note) 
                    VALUES (?, ?, ?, ?, ?)`;
        
        await executeQuery(sql, [id, category, amount, expense_date, note]);
        
        const newExpense = await executeQuery('SELECT * FROM expenses WHERE id = ?', [id]);
        res.json({ success: true, expense: newExpense[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery('DELETE FROM expenses WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Files
app.get('/api/files', async (req, res) => {
    try {
        const files = await executeQuery('SELECT * FROM files ORDER BY created_at DESC');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/files', async (req, res) => {
    try {
        const { file_number, client, service, location, status, note } = req.body;
        const id = generateId();
        
        const sql = `INSERT INTO files (id, file_number, client, service, location, status, note) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        await executeQuery(sql, [id, file_number, client, service, location, status, note]);
        
        const newFile = await executeQuery('SELECT * FROM files WHERE id = ?', [id]);
        res.json({ success: true, file: newFile[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/files/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery('DELETE FROM files WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dashboard statistics
app.get('/api/stats', async (req, res) => {
    try {
        const [clientCount, workCount, feeTotal, fileCount] = await Promise.all([
            executeQuery('SELECT COUNT(*) as count FROM clients'),
            executeQuery('SELECT COUNT(*) as count FROM works WHERE status = "In Progress"'),
            executeQuery('SELECT SUM(amount) as total FROM fees'),
            executeQuery('SELECT COUNT(*) as count FROM files')
        ]);

        res.json({
            totalClients: clientCount[0].count,
            activeWorks: workCount[0].count,
            totalFees: feeTotal[0].total || 0,
            totalFiles: fileCount[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Authentication endpoints
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const users = await executeQuery('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        
        if (users.length > 0) {
            res.json({ 
                success: true, 
                user: {
                    id: users[0].id,
                    username: users[0].username,
                    role: users[0].role
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users (admin only)
app.get('/api/users', async (req, res) => {
    try {
        const users = await executeQuery('SELECT id, username, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new admin user
app.post('/api/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }
        
        // Check if user already exists
        const existingUsers = await executeQuery('SELECT username FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, error: 'Username already exists' });
        }
        
        const id = generateId();
        const sql = `INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, 'admin')`;
        
        await executeQuery(sql, [id, username, password]);
        
        const newUser = await executeQuery('SELECT id, username, role, created_at FROM users WHERE id = ?', [id]);
        res.json({ success: true, user: newUser[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete admin user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deletion if it's the last admin
        const userCount = await executeQuery('SELECT COUNT(*) as count FROM users');
        if (userCount[0].count <= 1) {
            return res.status(400).json({ success: false, error: 'Cannot delete the last admin user' });
        }
        
        await executeQuery('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Start server
async function startServer() {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log(`TK Office Manager v5 Backend with MySQL running on http://localhost:${PORT}`);
        console.log('Make sure MySQL is running and the database is created using database.sql');
    });
}

startServer().catch(console.error);
