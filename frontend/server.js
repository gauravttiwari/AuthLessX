const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Main routes (BEFORE static middleware)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Redirect old index.html to home.html
app.get('/index.html', (req, res) => {
    res.redirect('/');
});

// Serve static files from current directory (AFTER routes)
app.use(express.static(__dirname));

// Catch all other routes and serve home.html (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 AuthLessX Frontend running on port ${PORT}`);
    console.log(`📱 Access: http://localhost:${PORT}`);
});