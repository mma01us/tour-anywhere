// app/routes.js

var Tour = require("../app/models/tour");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
var ObjectID = require('mongodb').ObjectID;
var tours = mongoose.model("Tour");
var path = require('path');

var privacyOptions = ["Private", "Hidden", "Public"];

module.exports = function(app, passport) {
    
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    })); 
    
    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();
    
        // if they aren"t redirect them to the home page
        res.redirect("/");
    }

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    /*app.all('*', function(req, res, next) {
      console.log(req);
      next();
    });*/
    app.get("/", function(req, res) {
        if(req.user != null) {
            res.redirect("/home");
        }
        res.render("../client/views/index.ejs"); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get("/login", function(req, res) {
        if(req.user != null) {
            res.redirect("/home");
        }
        // render the page and pass in any flash data if it exists
        res.render("../client/views/login.ejs", { message: req.flash("loginMessage") }); 
    });

    // process the login form
    // app.post("/login", do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get("/signup", function(req, res) {
        if(req.user != null)
            res.redirect("/home");
        // render the page and pass in any flash data if it exists
        res.render("../client/views/signup.ejs", { message: req.flash("signupMessage") });
    });

    // process the signup form
    // app.post("/signup", do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get("/home", isLoggedIn, function(req, res) {
        var tours = mongoose.model("Tour");
        tours.find({ uid: req.user._id}, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log("No tours found");
                res.render("../client/views/getstarted.ejs", {
                    user : req.user
                });
            }
            else {
                res.render("../client/views/home.ejs", {
                user : req.user, // get the user out of session and pass to template
                tours : docs
                });
            }
        });
    });
    app.get("/edit/:id", isLoggedIn, function(req, res){
        console.log("Edit for tour with id " + req.params["id"] + " requested.");
        Tour.find({ _id : req.params["id"], uid : req.user._id }, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log("Tour not found");
                res.redirect("/home");
            }
            else {
                res.render("../client/views/edit.ejs", {
                user : req.user, // get the user out of session and pass to template
                tour : docs[0]
                });
            }
        });
    });
    app.get("/tour/settings/:id", isLoggedIn, function(req, res){
        console.log("Tour settings for tour with id " + req.params["id"] + " requested.");
        Tour.find({ _id : req.params["id"], uid : req.user._id }, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log("Tour not found");
                res.redirect("/home");
            }
            else {
                res.render("../client/views/toursettings.ejs", {
                user : req.user, // get the user out of session and pass to template
                tour : docs[0]
                });
            }
        });
    });
    //create a new exhibit
    app.get("/create/exhibit/:id", isLoggedIn, function(req,res) {
        var ids = [];
        var r = 1;
        var regex = "";
        Tour.find({ _id : req.params["id"], uid : req.user._id }, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log("Tour not found");
                console.log(err);
                res.redirect("/home");
            }
            else {
                var tour = docs[0];
                for (var i = 0; i < docs[0].exhibits.length; i++) {
                    ids.push(docs[0].exhibits[i].eid);
                }
                while(ids.indexOf(r) != -1){
                    r++;
                }
                regex = "^(?!" + ids.join("$)(?!") + "$)\\d*$";
                console.log(regex);
                res.render("../client/views/createexhibit.ejs", {
                    tour : tour,
                    id : req.params["id"],
                    ids : ids,
                    regex : regex,
                    recommended : r
                });
            }
        });
    });
    //created a tour
    app.post("/done", isLoggedIn, function(req,res) {
        var myDateString = Date();
        
        var n = req.body.name,
            desc = req.body.desc,
            address1 = req.body.address1,
            address2 = req.body.address2,
            city1 = req.body.city,
            state1 = req.body.state,
            zip1 = req.body.zip,
            priv = req.body.privacy;
            
        console.log(req.user._id);
            
        Tour.create({ uid : req.user._id, name : n, description : desc, addr1 : address1, addr2 : address2, city : city1, state : state1, zip : zip1, privacy : privacyOptions.indexOf(priv), rating : -1, lastEdit : myDateString }, function (err, small) {
            if (err){
                console.log(err);
                return err;
            }
            // saved!
            res.redirect("/home");
        });
    });
    app.post("/create/exhibit/", isLoggedIn, function(req,res) {
        console.log(req.body);
        var n = req.body.name,
            id = req.body.ID,
            visibility = req.body.visibility === "yes",
            text = true,
            image = req.body.image === "yes",
            audio = req.body.audio === "yes",
            tourid = req.body.tourid,
            tourname = req.body.tourname;
        
        
        res.render("../client/views/createexhibit2.ejs", {
            n : n,
            id : id,
            visibility : visibility,
            text : text,
            image : image,
            audio : audio,
            tourid : tourid,
            tourname : tourname
        });
    });
    
    app.get("/edit/exhibit/:tid/:eid", isLoggedIn, function(req,res) {
        Tour.find({ _id : req.params["tid"], uid : req.user._id }, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log("Tour not found");
                console.log(err);
                res.redirect("/home");
            }
            else {
                var exhibit = docs[0].exhibits[0];
                
                for (var i = 0; i < docs[0].exhibits.length; i++) {
                    if(docs[0].exhibits[i].eid == req.params["eid"]){
                        exhibit = docs[0].exhibits[i];
                        break;
                    }
                }
                
                var text = true;
                
                if(exhibit.audio != null)
                    var audio = exhibit.audio;
                if(exhibit.image != null)
                    var image = exhibit.image;
                    
            var t;
            
            if(req.body.text && image && audio){
                t = exhibit.imageAudio.transcription;
            //exhibit.type = "Image and Audio Exhibit";
            }
            else if(text && image){
                t = exhibit.image.description;
                //exhibit.type = "Image Exhibit";
            }
            else if(text && audio){
                t = exhibit.audio.transcription;
                //exhibit.type = "Audio Exhibit";
            }
            else{
                t = exhibit.text.description;
                //exhibit.type = "Text Exhibit";
            }
                
                res.render("../client/views/editexhibit.ejs", {
                    tourid      : req.params["tid"],
                    id          : req.params["eid"],
                    n           : exhibit.name,
                    visibility  : exhibit.viewable,
                    t           : t,
                    text        : text,
                    image       : image,
                    audio       : audio,
                    tour        : docs[0]
                });
            }
        });
    });
    
    app.post("/edit/completeexhibit", isLoggedIn, function(req,res) {
        var myDateString = Date();
        
        var hasText = req.body.text != null,
            hasImage = req.body.image != null,
            hasAudio = req.body.audio != null;
            
        //var exhibit = { eid : req.body.id, name : req.body.n, viewable : req.body.visibility, lastEdit : myDateString };
        
        var exhibit = { eid : req.body.id, name : req.body.n, viewable : req.body.visibility, lastEdit : myDateString };
        
        if(req.body.text && hasImage && hasAudio){
            console.log("Edit audio and image exhibit");
            exhibit.imageAudio = { imageLink : req.body.image, audioLink : req.body.content, transcription : req.body.text};
            //exhibit.type = "Image and Audio Exhibit";
        }
        else if(hasText && hasImage){
            console.log("Edit image exhibit");
            exhibit.image = { imageLink : req.body.image, description : req.body.text };
            //exhibit.type = "Image Exhibit";
        }
        else if(hasText && hasAudio){
            console.log("Edit audio exhibit");
            exhibit.audio = { audioLink : req.body.content, transcription : req.body.text };
            //exhibit.type = "Audio Exhibit";
        }
        else{
            console.log("Edit text exhibit");
            exhibit.text = { description : req.body.text };
            //exhibit.type = "Text Exhibit";
        }
        
        Tour.findByIdAndUpdate( req.body.tourid, { $push : {exhibits : exhibit} }, {safe: true, upsert: true},
            function(err, doc) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(doc[0]);
                }
            } );
        
        console.log(req.user._id);
        res.redirect("/edit/" + req.body.tourid);
    });
    
    app.post("/edit/exhibit", isLoggedIn, function(req,res) {
        var myDateString = Date();
        
        var hasText = req.body.text != null,
            hasImage = req.body.image != null,
            hasAudio = req.body.audio != null;
            
        console.log(req.body);
        
        var visible = false;
        
        if(req.body.visibility === 'showing')
            visible = true;
        else if(req.body.visibility === 'hidden')
            visible = false;
        else if(req.body.current === 'true')
                visible = true;
        else if(req.body.current === 'false')
                visible = false;
        
        //var exhibit = { eid : req.body.id, name : req.body.n, viewable : req.body.visibility, lastEdit : myDateString };
        
        if(req.body.text && hasImage && hasAudio){
            console.log("Edit audio and image exhibit");
            Tour.find({ _id : ObjectID(req.body.tourid), uid : ObjectID(req.user._id) }, function (err, docs) {
            // if there are any errors, return the error before anything else
                if (err || docs.length === 0){
                    console.log(err);
                }
                else {
                    var ind = 0;
                    
                    for (var i = 0; i < docs[0].exhibits.length; i++) {
                        if(docs[0].exhibits[i].eid == req.body.id){
                            ind = i;
                            break;
                        }
                    }
                        
                    var p1 = 'exhibits.' + ind + '.name';
                    var p2 = 'exhibits.' + ind + '.viewable';
                    var p3 = 'exhibits.' + ind + '.lastEdit';
                    var p4 = 'exhibits.' + ind + '.imageAudio';
                    
                    tours.update(
                    {
                        "_id" : ObjectID(req.body.tourid)
                    }, 
                    { $set : 
                        {
                            [p1] : req.body.n,
                            [p2] : visible,
                            [p3] : myDateString,
                            [p4] : { 'imageLink' : req.body.image, 'audioLink' : req.body.content, 'transcription' : req.body.text},
                            lastEdit : myDateString
                        }
                    },
                    function(err, result){
                        if (err) {
                            console.log('Error updating object: ' + err);
                        } else {
                            console.log('' + result + ' document(s) updated');
                        }
                    });
                }
            });
        }
        else if(hasText && hasImage){
            console.log("Edit image exhibit");
            Tour.find({ _id : ObjectID(req.body.tourid), uid : ObjectID(req.user._id) }, function (err, docs) {
            // if there are any errors, return the error before anything else
                if (err || docs.length === 0){
                    console.log(err);
                }
                else {
                    var ind = 0;
                    
                    for (var i = 0; i < docs[0].exhibits.length; i++) {
                        if(docs[0].exhibits[i].eid == req.body.id){
                            ind = i;
                            break;
                        }
                    }
                        
                    var p1 = 'exhibits.' + ind + '.name';
                    var p2 = 'exhibits.' + ind + '.viewable';
                    var p3 = 'exhibits.' + ind + '.lastEdit';
                    var p4 = 'exhibits.' + ind + '.image';
                    
                    tours.update(
                    {
                        "_id" : ObjectID(req.body.tourid)
                    }, 
                    { $set : 
                        {
                            [p1] : req.body.n,
                            [p2] : visible,
                            [p3] : myDateString,
                            [p4] : { 'imageLink' : req.body.image, 'description' : req.body.text },
                            lastEdit : myDateString
                        }
                    },
                    function(err, result){
                        if (err) {
                            console.log('Error updating object: ' + err);
                        } else {
                            console.log('' + result + ' document(s) updated');
                        }
                    });
                }
            });
            
        }
        else if(hasText && hasAudio){
            console.log("Edit audio exhibit");
            Tour.find({ _id : ObjectID(req.body.tourid), uid : ObjectID(req.user._id) }, function (err, docs) {
            // if there are any errors, return the error before anything else
                if (err || docs.length === 0){
                    console.log(err);
                }
                else {
                    var ind = 0;
                    
                    for (var i = 0; i < docs[0].exhibits.length; i++) {
                        if(docs[0].exhibits[i].eid == req.body.id){
                            ind = i;
                            break;
                        }
                    }
                        
                    var p1 = 'exhibits.' + ind + '.name';
                    var p2 = 'exhibits.' + ind + '.viewable';
                    var p3 = 'exhibits.' + ind + '.lastEdit';
                    var p4 = 'exhibits.' + ind + '.audio';
                    
                    tours.update(
                    {
                        "_id" : ObjectID(req.body.tourid)
                    }, 
                    { $set : 
                        {
                            [p1] : req.body.n,
                            [p2] : visible,
                            [p3] : myDateString,
                            [p4] : { 'audioLink' : req.body.content, 'transcription' : req.body.text },
                            lastEdit : myDateString
                        }
                    },
                    function(err, result){
                        if (err) {
                            console.log('Error updating object: ' + err);
                        } else {
                            console.log('' + result + ' document(s) updated');
                        }
                    });
                }
            });
        }
        else{
            console.log("Edit text exhibit");
            Tour.find({ _id : ObjectID(req.body.tourid), uid : ObjectID(req.user._id) }, function (err, docs) {
            // if there are any errors, return the error before anything else
                if (err || docs.length === 0){
                    console.log(err);
                }
                else {
                    var ind = 0;
                    
                    for (var i = 0; i < docs[0].exhibits.length; i++) {
                        if(docs[0].exhibits[i].eid == req.body.id){
                            ind = i;
                            break;
                        }
                    }
                        
                    var p1 = 'exhibits.' + ind + '.name';
                    var p2 = 'exhibits.' + ind + '.viewable';
                    var p3 = 'exhibits.' + ind + '.lastEdit';
                    var p4 = 'exhibits.' + ind + '.text';
                    
                    tours.update(
                    {
                        "_id" : ObjectID(req.body.tourid)
                    }, 
                    { $set : 
                        {
                            [p1] : req.body.n,
                            [p2] : visible,
                            [p3] : myDateString,
                            [p4] : { 'description' : req.body.text },
                            lastEdit : myDateString
                        }
                    },
                    function(err, result){
                        if (err) {
                            console.log('Error updating object: ' + err);
                        } else {
                            console.log('' + result + ' document(s) updated');
                        }
                    });
                }
            });
        }
        res.redirect("/edit/" + req.body.tourid);
    });
    
    //create new tour
    app.get("/create", isLoggedIn, function(req,res) {
        res.render("../client/views/create.ejs");
    });
    app.get("/delete/tour/:id", isLoggedIn, function(req, res) {
        Tour.deleteOne({ _id : req.params["id"], uid : req.user._id }, function (err) {
          if (err){
              console.log(err);
              res.redirect("/edit/" + req.params["id"]);
              return;
          }
          // deleted at most one tour document
        });
        res.redirect("/home");
    });
    app.get("/delete/exhibit/:tid/:eid", isLoggedIn, function(req, res){
        console.log("Deleted exhibit with id " + req.params["eid"]);
        Tour.find({ _id : ObjectID(req.params["tid"]), uid : ObjectID(req.user._id) }, function (err, docs) {
            // if there are any errors, return the error before anything else
                if (err || docs.length === 0){
                    console.log("Error: " + err);
                    console.log("Got " + docs.length + " files.");
                }
                else {
                    var ind = 0;
                    
                    for (var i = 0; i < docs[0].exhibits.length; i++) {
                        if(docs[0].exhibits[i].eid == req.params["eid"]){
                            ind = i;
                            break;
                        }
                    }
                        
                    var p1 = 'exhibits.' + ind;
                    
                    tours.update(
                    {
                        "_id" : ObjectID(req.params["tid"])
                    }, 
                    { 
                        $set: { [p1] : null }
                    },
                    function(err, result){
                        if (err) {
                            console.log('Error setting to null object: ' + err);
                        } else {
                            console.log('' + result + ' document(s) set to null');
                            tours.update(
                            {
                                "_id" : ObjectID(req.params["tid"])
                            }, 
                            {
                                $pull : { "exhibits" : null }
                            },
                            function(err, result){
                                if (err) {
                                    console.log('Error deleting object: ' + err);
                                } else {
                                    console.log('' + result + ' document(s) deleted');
                                }
                            });
                        }
                    });
                }
            });
            res.redirect("/edit/" + req.params["tid"]);
    });
    app.post("/edit/tour/:id", isLoggedIn, function(req,res) {
        
        var myDateString = new Date();
        
        console.log(myDateString.toUTCString());
        
        var n = req.body.name,
            desc = req.body.desc,
            address1 = req.body.address1,
            address2 = req.body.address2,
            city1 = req.body.city,
            state1 = req.body.state,
            zip1 = req.body.zip,
            priv = req.body.privacy;
        console.log(priv);
        
        Tour.updateOne( { _id : req.params["id"], uid : req.user._id }, { name : n, description : desc, addr1 : address1, addr2 : address2, city : city1, state : state1, zip : zip1, privacy : privacyOptions.indexOf(priv), lastEdit : myDateString }, function (err, raw) {
              if (err) console.log(err);
              console.log("The raw response from Mongo was ", raw);
            });
        
        res.redirect("/edit/" + req.params["id"]);
    });
    
    app.get("/css/:file", function(req, res){
        res.sendFile(path.resolve(__dirname + "/../client/css/" + req.params["file"]));
    });
    
    app.get("/js/:file", function(req, res){
        res.sendFile(path.resolve(__dirname + "/../client/js/" + req.params["file"]));
    });
    
    app.get("/res/:file", function(req, res){
        res.sendFile(path.resolve(__dirname + "/../client/res/" + req.params["file"]));
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });
    // process the signup form
    app.post("/signup", passport.authenticate("local-signup", {
        successRedirect : "/home", // redirect to the secure profile section
        failureRedirect : "/signup", // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // process the login form
    app.post("/login", passport.authenticate("local-login", {
        successRedirect : "/home", // redirect to the secure profile section
        failureRedirect : "/login", // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // facebook routes
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
        
    // twitter routes
    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get("/auth/google", passport.authenticate("google", { scope : ["profile", "email"] }));

    // the callback after google has authenticated the user
    app.get("/auth/google/callback",
            passport.authenticate("google", {
                    successRedirect : "/home",
                    failureRedirect : "/"
            }));
            
    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
        app.get("/connect/local", function(req, res) {
            res.render("connect-local.ejs", { message: req.flash("loginMessage") });
        });
        app.post("/connect/local", passport.authenticate("local-signup", {
            successRedirect : "/home", // redirect to the secure profile section
            failureRedirect : "/connect/local", // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------
    // twitter --------------------------------
    // google ---------------------------------
};