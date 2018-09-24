//app/models/tours.js
var mongoose = require("mongoose");

//Generate schema
var tourSchema = mongoose.Schema({
    tid         : Number,
    name        : String,
    latitude    : Number,
    longitude   : Number,
    rating      : Number,
    lastEdit    : Date
});

// create the model for users and expose it to app
module.exports = mongoose.model('Tour', tourSchema);