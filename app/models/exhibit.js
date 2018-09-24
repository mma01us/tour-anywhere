//app/models/tours.js
var mongoose = require("mongoose");

//Generate schema
var exhibitSchema = mongoose.Schema({
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
});

// create the model for users and expose it to app
module.exports = mongoose.model('Exhibit', exhibitSchema);