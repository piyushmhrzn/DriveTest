const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const UserController = require('./controllers/userController');
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./models/User');
const port = 3000;

const app = new express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Connect to MongodDB
mongoose.connect('mongodb+srv://piyushmhzrn:206E9C9271@cluster0.egbj65n.mongodb.net/')
    .then(() => { console.log('Successfully connected to MonogDB'); })
    .catch((error) => { console.log('ERROR: ', error); });

// ROUTES
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/g', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.userId);

        if (!user) {
            return res.redirect('/login');
        }

        const licenseMatch = await bcrypt.compare('LICENSE123', user.license);

        if (licenseMatch) {
            return res.render('gTest', { user, isDefaultLicense: true });
        }

        res.render('gTest', { user, isDefaultLicense: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
});

app.get('/g2', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.userId);

        if (!user) {
            return res.redirect('/login');
        }

        const licenseMatch = await bcrypt.compare('LICENSE123', user.license);

        if (licenseMatch) {
            return res.render('g2Test', { user, isDefaultLicense: true });
        }

        res.render('g2Test', { user, isDefaultLicense: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// User Routes
app.post('/signUpUser', UserController.signUpUser);
app.post('/loginUser', UserController.loginUser);
app.post('/saveUserData', UserController.saveUserData);
app.post('/updateCarDetail', UserController.updateCarDetails);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});