const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// ✅ JSON API: Fetch all properties
router.get('/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM properties');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ✅ Render Homepage with All or Filtered by City
router.get('/', async (req, res) => {
    const { city } = req.query;
    try {
        const result = city
            ? await pool.query('SELECT * FROM properties WHERE city = $1', [city])
            : await pool.query('SELECT * FROM properties');

        res.render('index', { properties: result.rows });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ✅ Render Single Property Details Page
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Property not found");
        }

        res.render('propDetails', { property: result.rows[0] });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ✅ Handle Admin Add Property Form Submission
// ✅ Handle Admin Add Property Form Submission
router.post('/add', async (req, res) => {
    const {
        title,
        location,
        image_url,
        price,
        city,
        category,
        description,
        rera_no,
        carpet_area,
        configuration,
        possession,
        video_url,
        map_embed,
        bedrooms,
        bathrooms,
        furnishing,
        floorplan_url
    } = req.body;

    try {
        await pool.query(
            `INSERT INTO properties 
        (title, location, image_url, price, category, description, rera_no, carpet_area, configuration, possession, video_url, map_embed, bedrooms, bathrooms, furnishing, floorplan_url) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [
                title,
                location,
                image_url,
                price,
                city,
                category,
                description,
                rera_no,
                carpet_area,
                configuration,
                possession,
                video_url,
                map_embed,
                bedrooms,
                bathrooms,
                furnishing,
                floorplan_url
            ]
        );
        res.redirect('/properties');
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = router;
