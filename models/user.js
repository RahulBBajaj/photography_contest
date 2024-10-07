const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    votedPhotos: [{
        contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
        photoId: { type: mongoose.Schema.Types.ObjectId }
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
