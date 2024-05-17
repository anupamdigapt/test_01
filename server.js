const express = require('express');
var app = express();

// Body-parser Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Express-session
const session = require('express-session');
app.use(session({
    secret: 'local',
    saveUninitialized: true,
    resave: true
}));

// Express-flash
const flash = require('express-flash');
app.use(flash());

// Path
const path = require('path');

// Serve Static Resources
app.use('/public', express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

// Database
const { sequelize } = require('./config/database');
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

global.blacklistedTokens = new Set();

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// View Engine Setup
app.set('views', 'views');
app.set('view engine', 'ejs');

// Server listen
var PORT = process.env.PORT || 4000;
var HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, (error) => {
    if (error) throw error;
    console.log(`Express server started at http://${HOST}:${PORT}`);
});