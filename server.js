const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserController = require('./controllers/userController');
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
    res.render('gTest', { user: null, isUser: false });
});

app.get('/g2', (req, res) => {
    res.render('g2Test');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    res.render('login');
});

app.get('/error', (req, res) => {
    res.render('errorPage');
});

// User Routes
app.post('/signUpUser', UserController.signUpUser);
app.post('/saveUserData', UserController.saveUserData);
app.get('/findUser', UserController.findUser);
app.post('/updateCarDetail', UserController.updateCarDetails);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});