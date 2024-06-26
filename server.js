const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const uploadRoute = require('./routes/upload');
const viewPhotoRoute = require('./routes/view-photo');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/photo-contest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Check if Firebase Admin SDK is not already initialized
if (!admin.apps.length) {
    const serviceAccount = require('../serviceAccountKey.json'); // Path to your Firebase service account key file

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://photo-contest-007.appspot.com' // Replace 'your-storage-bucket-url' with your Firebase Storage bucket URL
    });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/users'));
app.use('/', require('./routes/users'));
app.use('/user', require('./routes/users'));
app.use('/upload', uploadRoute);
app.use('/view-photo', viewPhotoRoute);
const adminViewPhotoRouter = require('./routes/admin-view-photo');
app.use('/admin-view-photo', adminViewPhotoRouter);
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
