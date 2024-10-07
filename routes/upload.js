// upload.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Contest = require('../models/competition');
const firebase = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const { v4: uuidv4 } = require('uuid'); // Import the UUID library

// Initialize Firebase Admin SDK
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: 'gs://photo-contest-007.appspot.com'
});

// Set up multer storage for storing uploaded images in memory
const upload = multer({ storage: multer.memoryStorage() });

// GET request to render the upload page
router.get('/:uniqueId', async (req, res) => {
  try {
    const contest = await Contest.findOne({ uniqueId: req.params.uniqueId });
    if (!contest) {
      return res.status(404).send('Contest not found');
    }
    res.render('upload', { contest });
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST request to handle image upload
router.post('/:uniqueId', upload.single('image'), async (req, res) => {
  try {
    // Find the contest by uniqueId
    const contest = await Contest.findOne({ uniqueId: req.params.uniqueId });
    if (!contest) {
      return res.status(404).send('Contest not found');
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).send('No image uploaded');
    }

    // Save image to Firebase Storage
    const bucket = firebase.storage().bucket();
    const file = bucket.file(req.file.originalname);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    stream.on('error', (err) => {
      console.error('Error uploading to Firebase Storage:', err);
      res.status(500).send('Error uploading image');
    });

    stream.on('finish', async () => {
      // Generate a download token
      const downloadToken = uuidv4();

      // Update the file's metadata with the download token
      await file.setMetadata({
        metadata: {
          firebaseStorageDownloadTokens: downloadToken
        }
      });

      // Construct the URL in the Firebase format
      const encodedFileName = encodeURIComponent(req.file.originalname);
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFileName}?alt=media&token=${downloadToken}`;

      // Get the username and email from the request body
      const username = req.body.username;
      const email = req.body.email;

      // Update the contest document with the username, email, and the photo URL
      contest.uploads.push({ username, email, photoUrl: imageUrl });
      await contest.save();

      res.send('Upload successful');
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
