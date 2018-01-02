var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require(__dirname + '/../GLOBAL_CONSTANTS.js');
var database = require(__dirname + '/../model/database.js');

database.connect();

var userProfileSchema = new mongoose.Schema({
	_id : String,
	password : Number
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.TEST, _id: false});

var UserProfile = mongoose.model("UserProfile", userProfileSchema);

var userDAO = {_id: 'jiecao.wang@gmail.com', password: 1234};
var userJiecao = new UserProfile(userDAO);


userJiecao.save(function (err, userJiecao) {
  if (err) return console.error(err);
  console.log(userJiecao._id);
});
