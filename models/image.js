// models/image.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
    imageName: { type: String, required: true },
    imagePath: { type: String, required: true }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
