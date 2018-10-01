//app/models/tours.js
var mongoose = require("mongoose");

//Generate schema
var tourSchema = mongoose.Schema({
    tid         : Number,
    uid         : Number,
    name        : String,
    description : String,
    latitude    : Number,
    longitude   : Number,
    rating      : Number,
    privacy     : Number,
    exhibits    : [{
        eid                 : Number,
        tid                 : Number,
        name                : String,
        text                : {
            text            : String  
        },
        audio               : {
            audioLink       : String,
            transcription   : String
        },
        image               : {
            imageLink       : String,
            description     : String
        },
        imageAudio          : {
            imageLink       : String,
            audioLink       : String,
            description     : String,
            transcription   : String
        }
    }],
    lastEdit    : Date
});

// create the model for users and expose it to app
module.exports = mongoose.model('Tour', tourSchema);