const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const flashMiddleware = require('./middleware/flashMiddleware');
const config = require('./config');
const routes = require('./routes/routes');
const app = express();
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

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => { console.log('Successfully connected to MongoDB'); })
    .catch((error) => { console.log('ERROR: ', error); });

// Routes
app.use('/', routes);

// Live Server
app.listen(port, () => { console.log(`App listening on port: ${port}`); });
