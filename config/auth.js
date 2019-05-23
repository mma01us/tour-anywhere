// config/auth.js

//Source: https://scotch.io/tutorials/easy-node-authentication-google

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '907128619629590', // your App ID
        'clientSecret'  : '345ff8f774bf46aabd99d272a52ff002Reset', // your App Secret
        'callbackURL'   : 'https://tour-anywhere.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : '',
        'consumerSecret'    : '',
        'callbackURL'       : 'https://tour-anywhere.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '990788900195-mu1g359bdrffcvb4ka9dhfp4cqacuab6.apps.googleusercontent.com',
        'clientSecret'  : 'MDNtPq2elRzJMx_8zkocg4T7',
        'callbackURL'   : 'https://tour-anywhere.herokuapp.com/auth/google/callback'
    }

};