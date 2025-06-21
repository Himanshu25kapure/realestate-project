const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Dummy login check
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Show login form
router.get('/login', (req, res) => {
    res.render('admin/login');
});

// Handle login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.redirect('/admin/dashboard');
    } else {
        res.send("Invalid credentials");
    }
});

// Show property add form
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard'); // next step
});

// Handle add property
router.post('/add-property', async (req, res) => {
    const { title, location, image_url, price, category, description, rera_no, carpet_area, configuration, possession, video_url, map_embed } = req.body;
    try {
        await pool.query(
            `INSERT INTO properties 
      (title, location, image_url, price, category, description, rera_no, carpet_area, configuration, possession, video_url, map_embed) 
      VALUES 
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
            [title, location, image_url, price, category, description, rera_no, carpet_area, configuration, possession, video_url, map_embed]
        );
        res.redirect('/admin/dashboard');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
