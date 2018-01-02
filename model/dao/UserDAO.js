var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');

/************************ Table Schema *************************/
var userDAOSchema = new Schema({
	_id : { type: String, trim: true },
	password : {type: String/*, required: true*/},
	facebookId : { type: String },
	name : { type: String, trim: true },
	userIdType : { type: Number }, //0 for normal user, 1 for admin
	/*rating : { type: Number },
	_reviewIdArrayAreOngoing : [Schema.Types.ObjectId],
	_postIdArrayNotExpired : [Schema.Types.ObjectId],
	_postIdArrayExpired : [Schema.Types.ObjectId]
	*/
	postIdArray : [{ type: Schema.Types.ObjectId, ref: 'PostDAO'}]
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.USER, _id: false});

/************************ Static Methods *************************/
/*
	Mongoose provide static methods:
	http://mongoosejs.com/docs/documents.html
		document.findByIdAndRemove(_id, funciton(err, document))
		document.findByIdAndUpdate(_id, { $set: { password: 'new_pwd' }}, function (err, document))
*/

// create a new user document
userDAOSchema.statics.create = function(userId, password, facebookId, name,
	userIdType, rating, postIdArray/*
	reviewIdArrayAreOngoing, postIdArrayNotExpired, postIdArrayExpired*/){
	return new UserDAO({
		_id : userId,
		password : password,
		facebookId : facebookId,
		name : name,
		userIdType : userIdType,
		rating : rating // -1 rating before rated!
		/*
		reviewIdArrayAreOngoing : reviewIdArrayAreOngoing,
		postIdArrayNotExpired : postIdArrayNotExpired,
		postIdArrayExpired : postIdArrayExpired
		*/
	});
};

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

//the line below has to be called after we define the methods
var UserDAO = mongoose.model("UserDAO", userDAOSchema);

module.exports = UserDAO;
