// credits to https://scotch.io/tutorials/easy-node-authentication-facebook

// expose our config directly to our application using module.exports

module.exports = {

    'facebookAuth' : {
        'clientID'      : '1850159311915331', // App ID
        'clientSecret'  : '1b923a3401aee8eb4782bab96fce098c', // App Secret
        'callbackURL'   : '/auth/facebook/callback',
        'profileFields' : ['id', 'email', 'name']
    },

};