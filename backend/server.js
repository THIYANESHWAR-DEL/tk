const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Data storage (in production, use a proper database)
let DATA = {
    clients: [],
    works: [],
    fees: [],
    expenses: [],
    files: []
};

// Load data from file
function loadData() {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            DATA = JSON.parse(data);
        }
    } catch (error) {
        console.log('Error loading data:', error);
    }
}

// Save data to file
function saveData() {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        fs.writeFileSync(dataPath, JSON.stringify(DATA, null, 2));
    } catch (error) {
        console.log('Error saving data:', error);
    }
}

// Load initial data
loadData();

// API Routes
app.get('/api/data', (req, res) => {
    res.json(DATA);
});

app.post('/api/data', (req, res) => {
    DATA = req.body;
    saveData();
    res.json({ success: true });
});

app.get('/api/clients', (req, res) => {
    res.json(DATA.clients);
});

app.post('/api/clients', (req, res) => {
    const client = req.body;
    client.id = Date.now().toString();
    DATA.clients.push(client);
    saveData();
    res.json({ success: true, client });
});

app.get('/api/works', (req, res) => {
    res.json(DATA.works);
});

app.post('/api/works', (req, res) => {
    const work = req.body;
    work.id = Date.now().toString();
    DATA.works.push(work);
    saveData();
    res.json({ success: true, work });
});

app.get('/api/fees', (req, res) => {
    res.json(DATA.fees);
});

app.post('/api/fees', (req, res) => {
    const fee = req.body;
    fee.id = Date.now().toString();
    DATA.fees.push(fee);
    saveData();
    res.json({ success: true, fee });
});

app.get('/api/expenses', (req, res) => {
    res.json(DATA.expenses);
});

app.post('/api/expenses', (req, res) => {
    const expense = req.body;
    expense.id = Date.now().toString();
    DATA.expenses.push(expense);
    saveData();
    res.json({ success: true, expense });
});

app.get('/api/files', (req, res) => {
    res.json(DATA.files);
});

app.post('/api/files', (req, res) => {
    const file = req.body;
    file.id = Date.now().toString();
    DATA.files.push(file);
    saveData();
    res.json({ success: true, file });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.listen(PORT, () => {
    console.log(`TK Office Manager v5 Backend running on http://localhost:${PORT}`);
});
