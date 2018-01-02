// set up
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var passport = require('passport');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var database = require('./model/database.js');
var connected = false;
var fs = require('fs');

// get configurations
require('./config/passport')(passport);
var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: true, // do not automatically write to the session store
  //store: sessionStore,
  secret: 'csc309a3'
  //cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires, this line doesn't work, fix it later
}

app.set('port', (process.env.PORT || 5000));
// set up middleware
app.use(function(req, res, next){
	if(!connected){
		database.connect();
    connected = true;
	}
	next();
});
app.use( express.static( "public" ) );
//app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set up ejs templating
// views is directory for all template files
app.set('views',  __dirname + '/views/pages');
app.set('view engine', 'ejs');

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// import routes
require('./app/routes.js')(app, passport);

// Should define a regex here so that we can send whenever asked for user collection
app.get('/user', function (request, response) {
  response.send('user_collection');
});

// var nsp = io.of('/serviceAgreement');
// nsp.on('connection', function(socket){
//   console.log('someone connected to /serviceAgreement')

//   setUpBroadcast(socket, 'service cancelled');
//   setUpBroadcast(socket, 'consumer consent change');
//   setUpBroadcast(socket, 'provider consent change');
//   setUpBroadcast(socket, 'finalize');
//   setUpBroadcast(socket, 'enter edit mode');
//   setUpBroadcast(socket, 'exit edit mode');
// });

// function setUpBroadcast(socket, eventName) {
//   socket.on(eventName, function(data) {
//     nsp.emit(eventName, data);
//   });
// }

module.exports.server = server;