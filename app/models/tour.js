//app/models/tours.js
var mongoose = require("mongoose");

var textSchema = mongoose.Schema({
    description : String
});

var audioSchema = mongoose.Schema({
    audioLink       : String,
    transcription   : String
});

var imageSchema = mongoose.Schema({
    imageLink       : String,
    description     : String
});

var imageAudioSchema = mongoose.Schema({
        imageLink       : String,
        audioLink       : String,
        transcription   : String
    });
//
var exhibitSchema = mongoose.Schema({
    eid                 : Number,
    name                : String,
    viewable            : Boolean,
    text                : textSchema,
    audio               : audioSchema,
    image               : imageSchema,
    imageAudio          : imageAudioSchema,
    lastEdit    : Date
});

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
    exhibits    : [exhibitSchema],
    lastEdit    : Date
});

// create the model for users and expose it to app
module.exports = mongoose.model('Tour', tourSchema);