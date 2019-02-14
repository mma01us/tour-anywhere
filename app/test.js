var Tour = require("../app/models/tour");
var mongoose = require("mongoose");
var configDB = require("../config/database.js");
var ObjectID = require('mongodb').ObjectID;

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

var myDateString = Date();
var tours = mongoose.model("Tour");

var ind = 0;

Tour.find({ _id : ObjectID('5c001545f645950f082c36b3'), uid : ObjectID('5c001532f645950f082c36b2') }, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log(err);
            }
            else {
                ind = 0;
                
                for (var i = 0; i < docs[0].exhibits.length; i++) {
                    if(docs[0].exhibits[i].eid == 4){
                        ind = i;
                        break;
                    }
                }
                console.log(ind);
            }
});

console.log(ind);

var p1 = 'exhibits.' + ind + '.name';
var p2 = 'exhibits.' + ind + '.viewable';
var p3 = 'exhibits.' + ind + '.lastEdit';
var p4 = 'exhibits.' + ind + '.text';

console.log(p1);

tours.update(
    {
        "_id" : ObjectID('5c001545f645950f082c36b3')
    }, 
    { $set : 
        {
            [p1] : 'TEST',
            [p2] : false,
            [p3] : myDateString,
            [p4] : { 'description' : 'test desc.' }
        }
    },
    function(err, result){
        if (err) {
            console.log('Error updating object: ' + err);
        } else {
            console.log('' + result + ' document(s) updated');
        }
    }
);
//id = '5c001545f645950f082c36b3'
//uid = '5c001532f645950f082c36b2'
///5c34d10ee70a7e0f4bec3ad4
/*
'exhibits.4.name' : 'TEST',
                'exhibits.4.viewable' : false,
                'exhibits.4.lastEdit' : myDateString,
                'exhibits.4.text' : { 'description' : 'test desc.' }
*/