// app/routes.js

var Tour = require("../app/models/tour");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");

var privacyOptions = ["Private", "Hidden", "Public"];

module.exports = function(app, passport) {
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.use(bodyParser.json());
    
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
        var tours = mongoose.model("Tour");
        tours.find({ _id : req.params["id"], uid : req.user._id }, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log("Tour not found");
                res.redirect("../client/views/home.ejs");
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
        var tours = mongoose.model("Tour");
        tours.find({ _id : req.params["id"], uid : req.user._id }, function (err, docs) {
            // if there are any errors, return the error before anything else
            if (err || docs.length === 0){
                console.log("Tour not found");
                res.redirect("../client/views/home.ejs");
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
    app.get("/create/exhibit", isLoggedIn, function(req,res) {
        res.render("../client/views/createexhibit.ejs", {
            tour : req.tour
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
    app.post("/create/exhibit", isLoggedIn, function(req,res) {
        var n = req.body.name,
            tourid = req.body.ID,
            visibility = req.body.visibility === "yes",
            text = true,
            image = req.body.image === "yes",
            audio = req.body.audio === "yes";
        
        console.log(req.user._id);
        res.render("../client/views/editexhibit.ejs", {
            n : n,
            tourid : tourid,
            visibility : visibility,
            text : text,
            image : image,
            audio : audio
        });
    });
    
    app.post("/edit/exhibit", isLoggedIn, function(req,res) {
        var myDateString = Date();
        
        var n = req.n,
            tourid = req.tourid,
            visibility = req.visibility,
            hasText = req.text,
            hasImage = req.image,
            hasAudio = req.audio;
        
        console.log(req.user._id);
        res.render("../client/views/editexhibit.ejs");
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
    app.post("/edit/tour/:id", isLoggedIn, function(req,res) {
        var myDateString = Date();
        
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
        res.sendFile("/home/ubuntu/workspace/client/css/" + req.params["file"]);
    });
    
    app.get("/js/:file", function(req, res){
        res.sendFile("/home/ubuntu/workspace/client/js/" + req.params["file"]);
    });
    
    app.get("/res/:file", function(req, res){
        res.sendFile("/home/ubuntu/workspace/client/res/" + req.params["file"]);
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
    // twitter routes

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

        // send to google to do the authentication
        app.get("/connect/google", passport.authorize("google", { scope : ["profile", "email"] }));

        // the callback after google has authorized the user
        app.get("/connect/google/callback",
            passport.authorize("google", {
                successRedirect : "/home",
                failureRedirect : "/"
            }));
};