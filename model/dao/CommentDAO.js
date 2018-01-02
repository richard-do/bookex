var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');
var util = require('./../../control/util.js');

/************************ Table Schema *************************/
var commentDAOSchema = new mongoose.Schema({
	_id : {
		type: mongoose.Schema.Types.ObjectId, 
		trim: true 
	},
	description : {
		type: String, 
		trim: true,
		required: true
	},
	authorId : {
		type: String,
		ref: "UserDAO",
		trim: true,
		required: true
	},
	createdAt : {
		type: Number, 
		required: true
	},
}, {collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.COMMENT, _id: false});

/************************ Static Methods *************************/
/*
	Mongoose provide static methods:
	http://mongoosejs.com/docs/documents.html
		document.findByIdAndRemove(_id, funciton(err, document))
		document.findByIdAndUpdate(_id, { $set: { password: 'new_pwd' }}, function (err, document))
*/
commentDAOSchema.statics.create = function(commentId, description, authorId, createdAt){
	return new CommentDAO({
		_id: commentId,
		description: description,
		authorId: authorId,
		createdAt: createdAt
	});
};

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

var CommentDAO = mongoose.model("CommentDAO", commentDAOSchema);

module.exports = CommentDAO;