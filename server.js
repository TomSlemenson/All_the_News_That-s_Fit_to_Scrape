require("dotenv").config();
const express = require("express");
const path = require('path');
const logger = require("morgan");
const mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI|| "mongodb://localhost/mongoHeadlines";

// Initialize Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//set up handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static(path.join(__dirname, 'public')));

require('./router.js')(app);

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
