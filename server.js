const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const port = 3000;

const app = new express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongodDB
mongoose.connect('mongodb+srv://piyushmhzrn:206E9C9271@cluster0.egbj65n.mongodb.net/')
    .then(() => { console.log('Successfully connected to MonogDB'); })
    .catch((error) => { console.log('ERROR: ', error); });


// ROUTES
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/g', (req, res) => {
    res.render('gTest', {
        user: null,
        isUser: false
    });
});

app.get('/g2', (req, res) => {
    res.render('g2Test');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/error', (req, res) => {
    res.render('errorPage');
});

// Save user data from file to mongoDB
app.post('/saveUserData', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/');
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/error');
    }
});

// Find user using license number
app.get('/findUser', async (req, res) => {
    try {
        const license_number = req.query.license_number;
        const user = await User.findOne(
            { license: license_number }
        );

        if (!user) {
            return res.render('gTest', { user: null, isUser: true });
        }

        res.render('gTest', { user, isUser: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/error');
    }
});

// Update only the car details of the user
app.post('/updateCarDetail', async (req, res) => {
    try {
        const license_number = req.body.license_number;
        const updatedCarDetails = {
            'carDetails.company': req.body.company,
            'carDetails.model': req.body.model,
            'carDetails.year': req.body.year,
            'carDetails.plateNumber': req.body.plateNumber
        };

        const user = await User.findOneAndUpdate(
            { license: license_number },
            { $set: updatedCarDetails },
            { new: true }
        );

        if (!user) {
            return res.render('gTest', { user: null, isUser: true });
        }

        res.render('gTest', { user, isUser: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/error');
    }
});



app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});