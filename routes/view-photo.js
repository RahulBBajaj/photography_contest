const express = require('express');
const router = express.Router();
const Contest = require('../models/competition');
const User = require('../models/user');

// GET request to render the view photo page
router.get('/:uniqueId', async (req, res) => {
    try {
        const contest = await Contest.findOne({ uniqueId: req.params.uniqueId }).populate('uploads');
        if (!contest) {
            return res.status(404).send('Contest not found');
        }
        res.render('view-photo', { photos: contest.uploads });
    } catch (error) {
        console.error('Error fetching contest:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to handle voting
// POST request to handle voting
router.post('/vote', async (req, res) => {
    try {
        const { photoId } = req.body; // Get the photo ID from the request body
        const contest = await Contest.findOne({ 'uploads._id': photoId });

        if (!contest) {
            return res.status(404).send('Contest not found');
        }

        const photo = contest.uploads.find(p => p._id == photoId);
        if (!photo) {
            return res.status(404).send('Photo not found');
        }

        // Increment the vote count for the photo
        photo.voteCount += 1;
        await contest.save();

        res.send('Vote successful');
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).send('Internal Server Error');
    }
});
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
