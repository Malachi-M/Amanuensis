// Requiring dependent modules
var express = require('express');
var bodyParser = require("body-parser");
var hbs = require("hbs");
var hbsutils = require('hbs-utils')(hbs);
var stylus = require('stylus');
var cookieParser =require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');


var Blog = require('./models/post-model');


var app = express(); // Initiating a new express instance.

mongoose.connect('mongodb://' + (process.env.IP || 'localhost') + '/blogposts'); //connecting to the database named '/blogposts' over process.env.IP


app.set('view engine', 'html'); // Setting the views for the templates to be read as html files from the handlebar engine.
app.engine('html', hbs.__express);

hbsutils.registerPartials('views/partials');

app.use(stylus.middleware(__dirname + '/public/css'));

app.set('port', process.env.PORT || 1337); // Setting the Port and IP as either system determined or hardcoded.
app.set('ip', process.env.IP || '127.0.0.1');

app.use(express.static('public')); // Static files served from '/public'


app.use(bodyParser.urlencoded({ //bodyParse is used to parse the body of Post requests. extended to false stops the 'qs' lib from parsing for extended syntax.
    extended: false
}));

app.use(cookieParser('I am the Violet Flame.'));
app.use(session({
    secret: "Become nothing, and He'll turn you into everything.",
    resave: true,
    saveUninitialized: true,
    store: require('mongoose-session')(mongoose)
}));

app.use(require('./routes/').init());

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Knock, and He'll open the door.\nVanish, and He'll make you Shine like the sun.\nFall, and He'll raise you to the heavens.\nBecome nothing, and He'll turn you into everything.\n--Rumi");
    console.log("Amanuensis is up and running on https://%s:%s", address.address, address.port);
});
