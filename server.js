var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var MONGODB_URI = "mongodb://heroku_25rbtb58:jmnog9djbash9hb3vqegimq6f4@ds253567.mlab.com:53567/heroku_25rbtb58"|| "mongodb://localhost/mongoHeadlines";

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

require('./router.js')(app);

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
