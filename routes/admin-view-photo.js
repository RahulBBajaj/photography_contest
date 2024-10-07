// admin-view-photo.js

const express = require('express');
const router = express.Router();
const Contest = require('../models/competition');

// GET request to render the admin view photo page
router.get('/:uniqueId', async (req, res) => {
    try {
        const contest = await Contest.findOne({ uniqueId: req.params.uniqueId }).populate('uploads');
        if (!contest) {
            return res.status(404).send('Contest not found');
        }
        res.render('admin-view-photo', { photos: contest.uploads });
    } catch (error) {
        console.error('Error fetching contest:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
