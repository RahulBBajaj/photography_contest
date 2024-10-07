// competition.js

const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    lastDate: { type: Date, required: true },
    uniqueId: { type: Number, required: true },
    imagePath: { type: String },
    uploads: [{
        username: { type: String, required: true },
        email: { type: String }, // Add a new field for email address
        photoUrl: { type: String, required: true },
        voteCount: { type: Number, default: 0 }
    }]
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
