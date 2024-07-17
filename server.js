const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const UserController = require('./controllers/UserController');
const PageController = require('./controllers/PageController');
const AuthController = require('./controllers/AuthController');
const AdminController = require('./controllers/AdminController');
const authMiddleware = require('./middleware/authMiddleware');
const flashMiddleware = require('./middleware/flashMiddleware');
const config = require('./config');
const app = new express(); // Use express
const port = 3000;

// Middlewares
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({ secret: config.SESSION_SECRET, resave: false, saveUninitialized: true }));

// Flash setup
app.use(flash());
app.use(flashMiddleware);

// Connect to MongodDB
mongoose.connect(config.MONGODB_URI)
    .then(() => { console.log('Successfully connected to MonogDB'); })
    .catch((error) => { console.log('ERROR: ', error); });

// Page Routes
app.get('/', PageController.homePage);
app.get('/g', authMiddleware('driver'), PageController.gPage);
app.get('/g2', authMiddleware('driver'), PageController.g2Page);
app.get('/logout', authMiddleware('driver'), PageController.logout);
app.get('/login', PageController.login);

// Authentication
app.post('/signUpUser', AuthController.signUpUser);
app.post('/loginUser', AuthController.loginUser);

// User
app.post('/updateUserDetails', UserController.updateUserDetails);
app.post('/updateCarDetails', UserController.updateCarDetails);

// Admin
app.get('/appointment', authMiddleware('admin'), AdminController.appointment);
app.post('/addAppointment', AdminController.addAppointment);

// Live Server
app.listen(port, () => { console.log(`App listening on port: ${port}`); });