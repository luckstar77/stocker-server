//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ModelSchema = new Schema({
    id: String,
    name: String,
});

// Compile model from schema
module.exports = mongoose.model('StockModel', ModelSchema );