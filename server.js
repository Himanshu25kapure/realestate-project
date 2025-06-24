const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');

// Routes
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(flash());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pass user and flash messages to all views
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? { id: req.session.userId, email: req.session.userEmail } : null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/admin', adminRoutes);
app.use('/properties', propertyRoutes);
app.use('/', userRoutes);

// Home page redirects to property listings
app.get('/', (req, res) => {
    res.redirect('/properties');
});

// Static EJS Pages
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/property-detail', (req, res) => res.render('property-detail'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
