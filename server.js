const express = require('express');
const ejs = require('ejs');
const app = new express();
const port = 3000;

// Use public folder
app.use(express.static(__dirname + '/public'));

// Use Embedded Javascript as templating engine
app.set('view engine', 'ejs');

// ROUTES
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/g', (req, res) => {
    res.render('gTest');
});

app.get('/g2', (req, res) => {
    res.render('g2Test');
});

app.get('/login', (req, res) => {
    res.render('login');
});


// LISTENER
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});