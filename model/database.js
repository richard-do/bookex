/*http://theholmesoffice.com/mongoose-connection-best-practice/*/
var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require(__dirname + '/../GLOBAL_CONSTANTS.js');
var db;

// Remove the deprecated mPromise issue
mongoose.Promise = global.Promise;
// Create the database connection 
var connect = function (){
	db = mongoose.connect(GLOBAL_CONSTANTS.MODEL.DATABASE_URI);
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + GLOBAL_CONSTANTS.MODEL.DATABASE_URI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected with ' + GLOBAL_CONSTANTS.MODEL.DATABASE_URI); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});



module.exports.connect = connect;
module.exports.db = db;