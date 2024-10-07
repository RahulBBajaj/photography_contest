// routes/users.js

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Contest= require('../models/competition');
const Competition = require('../models/competition');
router.get('/live-competition', async (req, res) => {
    try {
        // Fetch live competitions from the database
        const competitions = await Competition.find({}); // Assuming Competition model exists

        // Render the view live competition page with the fetched competitions
        res.render('view-livecompetition', { competitions });
    } catch (error) {
        console.error('Error fetching live competitions:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/dashboard', async (req, res) => {
    try {
        // Fetch contests
        const contests = await Contest.find();

        // Fetch users
        const users = await User.find();
        const loggedInUsername = 'JohnDoe';
        // Render user dashboard with contests and users
        res.render('user-dashboard', { contests, users,loggedInUsername });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './views' });
});
router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './views' });
});

router.post('/register', async (req, res) => {
    try {
        const { username,email, password, mobileNumber } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        // Create a new user document
        const newUser = new User({
            username,
            email,
            password, // Hash password before saving in production
            mobileNumber,
            // Other fields as needed
        });

        // Save the user document to MongoDB
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});
// routes/users.js

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if password is correct
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
});
router.get('/won-photographers', async (req, res) => {
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
        res.render('won-photographers', { winners: winners });
    } catch (error) {
        console.error('Error fetching won photographers:', error);
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
module.exports = router;
