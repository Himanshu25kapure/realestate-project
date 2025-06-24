const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db/db');

// Helper: Validate email format
function isValidEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
// Helper: Validate password strength (min 6 chars)
function isStrongPassword(password) {
    return password.length >= 6;
}

// GET Register
router.get('/register', (req, res) => {
    res.render('register');
});

// POST Register
router.post('/register', async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/register');
    }
    if (!isValidEmail(email)) {
        req.flash('error', 'Invalid email format.');
        return res.redirect('/register');
    }
    if (!isStrongPassword(password)) {
        req.flash('error', 'Password must be at least 6 characters.');
        return res.redirect('/register');
    }
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/register');
    }
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            req.flash('error', 'Email already registered.');
            return res.redirect('/register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error', 'Registration failed. Try again.');
        res.redirect('/register');
    }
});

// GET Login
router.get('/login', (req, res) => {
    res.render('login');
});

// POST Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/login');
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        const user = userResult.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        req.flash('success', 'Login successful!');
        res.redirect('/dashboard');
    } catch (err) {
        req.flash('error', 'Login failed. Try again.');
        res.redirect('/login');
    }
});

// GET Logout
router.get('/logout', (req, res) => {
    req.flash('success', 'Logged out successfully.');
    req.session.userId = null;
    req.session.userEmail = null;
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// GET Dashboard (user home)
router.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        req.flash('error', 'Please log in to access your dashboard.');
        return res.redirect('/login');
    }
    res.render('dashboard', { user: { id: req.session.userId, email: req.session.userEmail } });
});

module.exports = router; 