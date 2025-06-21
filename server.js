// server.js
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

// DB connection is handled in route files
// Import routes
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');


// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/admin', adminRoutes);
// Set the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route: Dynamic property listings
app.use('/properties', propertyRoutes);

// Route: Static EJS pages
app.get('/', (req, res) => {
    res.redirect('/properties'); // home page = property listings
});

app.get('/about.ejs', (req, res) => {
    res.render('about');
});

app.get('/index.ejs', (req, res) => {
    res.render('index');
});

app.get('/contact.ejs', (req, res) => {
    res.render('contact');
});

app.get('/login.ejs', (req, res) => {
    res.render('login');
});

app.get('/register.ejs', (req, res) => {
    res.render('register');
});

// Optional: if you have a separate property detail page
app.get('/property-detail.ejs', (req, res) => {
    res.render('property-detail'); // rename to .ejs and place in /views
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
