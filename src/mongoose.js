//Import the mongoose module
var mongoose = require('mongoose');
var { mongo } = require('./config');

//Set up default mongoose connection
var mongoDB = `mongodb://${mongo.host}/${mongo.database}`;
mongoose.connect(mongoDB, { useNewUrlParser: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;