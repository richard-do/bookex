var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require(__dirname + '/../GLOBAL_CONSTANTS.js');

//
module.exports = function (){
	mongoose.connect(GLOBAL_CONSTANTS.MODEL.DATABASE_URI);
};