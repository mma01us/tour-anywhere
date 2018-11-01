//app/models/tours.js
var mongoose = require("mongoose");

//Generate schema
var tourSchema = mongoose.Schema({
    uid         : String,
    name        : String,
    description : String,
    addr1       : String,
    addr2       : String,
    city        : String,
    state       : String,
    zip         : Number,
    rating      : Number,
    privacy     : Number,
    exhibits    : [{
        eid                 : Number,
        tid                 : Number,
        name                : String,
        viewable            : Boolean,
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
            transcription   : String
        },
        lastEdit    : Date
    }],
    lastEdit    : Date
});

// create the model for users and expose it to app
module.exports = mongoose.model('Tour', tourSchema);