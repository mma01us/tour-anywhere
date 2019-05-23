// config/auth.js

//Source: https://scotch.io/tutorials/easy-node-authentication-google

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '', // your App ID
        'clientSecret'  : '', // your App Secret
        'callbackURL'   : ''
    },

    'twitterAuth' : {
        'consumerKey'       : '',
        'consumerSecret'    : '',
        'callbackURL'       : ''
    },

    'googleAuth' : {
        'clientID'      : '990788900195-mu1g359bdrffcvb4ka9dhfp4cqacuab6.apps.googleusercontent.com',
        'clientSecret'  : 'MDNtPq2elRzJMx_8zkocg4T7',
        'callbackURL'   : 'https://tour-anywhere.herokuapp.com/auth/google/callback'
    }

};