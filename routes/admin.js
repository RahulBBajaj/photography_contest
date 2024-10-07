// routes/admin.js

const express = require('express');
const router = express.Router();
const Contest = require('../models/competition');
const nodemailer = require('nodemailer');
// Import Mongoose
const mongoose = require('mongoose');

// const mongoose = require('mongoose');
// const Contest = require('./models/competition');

// GET request to render the view contests page
router.get('/view-contests', async (req, res) => {
    try {
        const contests = await Contest.find();
        res.render('view-contests', { contests });
    } catch (error) {
        console.error('Error fetching contest details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to handle deleting a contest
router.post('/contest/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the contest by ID and delete it
        await Contest.findByIdAndDelete(id);

        // Redirect back to the view contests page after deletion
        res.redirect('/admin/view-contests');
    } catch (error) {
        console.error('Error deleting contest:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Import Contest model


// Rest of your route handlers...

// GET request to render the admin login page
router.get('/login', (req, res) => {
    res.sendFile('admin-login.html', { root: './views' });
});


// POST request to handle admin login form submission
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password match the admin credentials (you can hardcode them for simplicity)
    if (email === 'admin@admin.com' && password === '1234') {
        // Authentication successful
        
        res.status(200).json({ message: 'Login successful' });
        
    } else {
        // Authentication failed
        res.status(401).json({ message: 'Invalid email or password' });
    }
});
router.get('/dashboard', (req, res) => {
    res.sendFile('admin-dashboard.html', { root: './views' });
});
// POST request to handle adding a new competition
router.post('/add-competition', async (req, res) => {
    try {
        const { uniqueId,topic, lastDate } = req.body;

        // Create a new contest document
        const newContest = new Contest({
            uniqueId: uniqueId, 
            topic,
            lastDate,

        });

        // Save the contest document to MongoDB
        await newContest.save();

        res.status(201).send({ message: 'Contest details added successfully' });
    } catch (error) {
        console.error('Error adding contest details:', error);
        res.status(500).send({ message: 'Failed to add contest details' });
    }
});
// POST request to handle adding a new competition
router.post('/add-competition', async (req, res) => {
    try {
        const { topic, lastDate, uniqueId } = req.body;

        // Create a new contest document
        const newContest = new Contest({
            uniqueId: uniqueId, // Include the unique ID in the document
            topic: topic,
            lastDate: lastDate,
            // Add more fields as needed
        });

        // Save the contest document to MongoDB
        await newContest.save();

        res.status(201).send({ message: 'Contest details added successfully' });
    } catch (error) {
        console.error('Error adding contest details:', error);
        res.status(500).send({ message: 'Failed to add contest details' });
    }
});

// GET request to render the view contests page
router.get('/view-contests', async (req, res) => {
    try {
        // Fetch all contest documents from MongoDB
        const contests = await Contest.find();

        // Render the view contests page with contest details
        res.render('view-contests', { contests });
    } catch (error) {
        console.error('Error fetching contest details:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/admin/won-photographers', async (req, res) => {
    try {
        // Find all contests
        const contests = await Contest.find();

        // Initialize an array to store winners
        const winners = [];

        // Iterate through each contest to find the winner
        contests.forEach(contest => {
            // Initialize variables to track the highest vote count, the winner, and the winning photo
            let highestVoteCount = 0;
            let winner = '';
            let winningPhoto = '';
            let email='';

            contest.uploads.forEach(upload => {
                if (upload.voteCount > highestVoteCount) {
                    highestVoteCount = upload.voteCount;
                    winner = upload.username;
                    winningPhoto = upload.photoUrl;
                    if (upload.email) { // Check if upload.email is not undefined
                        email = upload.email;
                    }
                }
            });

            // Add the winner to the winners array
            winners.push({
                contestId: contest.uniqueId,
                winner: winner,
                photoUrl: winningPhoto,
                email: email,
            });
        });

        console.log(winners); // Log the winners array
        res.render('admin-won-photographers', { winners: winners });
    } catch (error) {
        console.error('Error fetching won photographers:', error);
        res.status(500).send('Internal Server Error');
    }
});
//const nodemailer = require('nodemailer');

// Add a route to handle sending notifications to winners
router.post('/notify', async (req, res) => {
    try {
        const { email } = req.body;

        // Create a transporter object using nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'luciferjenisis@gmail.com', // Enter your email address
                pass: 'hmeo smdf jwam omdi' // Enter your email password or app-specific password
            }
        });

        // Define email options
         let mailOptions = {
            from: 'luciferjenisis@gmail.com', // Sender address
            to: email, // Recipient address
            subject: 'Congratulations! You are the winner', // Subject line
            text: `Dear ${email.split('@')[0]},\n\nCongratulations! You have won the competition which you have participated.\n\nKeep up the great work!\n\nBest regards,\nThe Admin Team` // Plain text body
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        // Send a response back to the client
        res.status(200).send({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send({ message: 'Failed to send notification' });
    }
});
// routes/admin.js
const Competition = require('../models/competition');
router.get('/live-competition', async (req, res) => {
    try {
        // Fetch live competitions from the database
        const competitions = await Competition.find({}); // Assuming Competition model exists

        // Render the view live competition page with the fetched competitions
        res.render('admin-view-livecompetition', { competitions });
    } catch (error) {
        console.error('Error fetching live competitions:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin/view-photo/:uniqueId', async (req, res) => {
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

// POST request to handle choosing the winner and notifying via email
router.post('/notify-winner', async (req, res) => {
    try {
        const { email } = req.body;

        // Create a transporter object using nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'luciferjenisis@gmail.com', // Enter your email address
                pass: 'hmeo smdf jwam omdi' // Enter your email password or app-specific password
            }
        });

        // Define email options
        let mailOptions = {
            from: 'luciferjenisis@gmail.com', // Sender address
            to: email, // Recipient address
            subject: 'Congratulations! You are the winner', // Subject line
            text: `Dear ${email.split('@')[0]},\n\nCongratulations! You have won the competition as you were selected by the admin.\n\nKeep up the great work!\n\nBest regards,\nThe Admin Team` // Plain text body
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        // Send a response back to the client
        res.status(200).send({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send({ message: 'Failed to send notification' });
    }
});



module.exports = router;
