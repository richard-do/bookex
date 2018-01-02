// References and credits:
// http://passportjs.org/docs
// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local\
// https://scotch.io/tutorials/easy-node-authentication-facebook
// https://github.com/jaredhanson/passport-local/blob/master/examples/express3/app.js

// import/load authentication strategies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// import/load the user model in control layer
var UserBO = require('./../control/businessObject/UserBO.js');

// load the authentication variables
var authConfig = require('./auth');

var Converter = require('./../model/Converter.js');


module.exports = function (passport) {

    // User login session handler
    passport.serializeUser(function (user, done) {
        var sessionUser = new UserBO(user._userId, user._password, 
            user._facebookId, user._name, user._userIdType, user._rating);
        // var sessionUser = Converter.convertFromUserDAOtoUserBO(user);
        done(null, sessionUser);
    });

    passport.deserializeUser(function (sessionUser, done) {
        done(null, sessionUser);
    });

    // Sign up strategy
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        process.nextTick(function() {

            UserBO.validateId(email, function (err, valid) {

                if (err) {
                    // return any existing errors
                    return done(err);
                }

                // set up flash message if entered email is already taken
                if (valid) {
                    return done(null, false, req.flash('signupMessage', 'Email is already taken!'));
                } 
                // create the user otherwise
                else {
                    var name = req.params.name;
                    var newUser = new UserBO(email, password, "", name, 0, -1, [], [], [], [], []); // so far we have 7 fields, i don't get why we are supplying extra param
                    newUser.save(function (err) {
                        if (err) {
                            return done(err);
                        } else {
                            return done(null, newUser);
                        }
                    });
                }

            });
        });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // check if user exists, then the user password combination validity
        // pass any error messages to flash module
        UserBO.validateId(email, function (err, valid) {

            // return any existing errors
            if (err) {
                return done(err);
            }                 
            if (!valid) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            UserBO.validateIdPw(email, password, function (err, validUser) {
                if (err) {
                    return done(err);
                }
                if (!validUser) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, validUser);
            });
        });
    }));

    passport.use(new FacebookStrategy({

        clientID: authConfig.facebookAuth.clientID,
        clientSecret: authConfig.facebookAuth.clientSecret,
        callbackURL: authConfig.facebookAuth.callbackURL,
        profileFields: authConfig.facebookAuth.profileFields

    },
    function(accessToken, refreshToken, profile, done) {

        //console.log("Profile Obj: %j", profile);

        // asynchronous
        process.nextTick(function() {

            UserBO.validateFbId(profile.id, profile.emails[0].value, 
                profile.name.givenName, function (err, user) {

                // if there is an error, return that error
                if (err) {
                    return done(err);
                }

                // if the user is found, log them in
                if (user) {
                    return done(null, user);
                }

                if (!profile.emails[0].value) {
                    return done(null, false, req.flash('fbSignupMessage', 
                        'Please verify your email with facebook or use local signup.'));
                }

                // if no user found, check if the primary email associated with 
                // facebook account is already taken
                UserBO.validateId(profile.emails[0].value, function (err, existing) {

                    // if there is an error, return that error
                    if (err) {
                        return done(err);
                    }

                    if (existing) {
                        return done(null, false, req.flash('fbSignupMessage', 
                            'Email is already taken!'));
                    }

                    // create a new user with that facebook id
                    var newUser = new UserBO(profile.emails[0].value, "", profile.id,  
                        profile.name.familyName, 0, -1, [], [], [], [], []);

                    newUser.save(function (err) {
                        if (err) {
                            return done(err);
                        } else {
                            return done(null, newUser);
                        }
                    })
                

                })
                

            });
        });
    }));

}
