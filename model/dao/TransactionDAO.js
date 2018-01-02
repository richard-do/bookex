var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');






var transactionDAOSchema = new mongoose.Schema({
	postId : {type: String, required: true},
	providerId: {type: String, required: true},
	consumerId: {type: String, required: true},
	mutualAgreementId: {type: String, required: true},
	consumerReviewId: {type: String, required: false},
	providerReviewId: {type: String, required: false},
	// creationDate: {type: int, required: true}
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.TRANSACTIONS, _id: true});

transactionDAOSchema.statics.create = function(postId, providerId, consumerId, mutualAgreementId, consumerReviewId, providerReviewId, creationDate){
	return new TransactionDAO({
		postId: postId,
		providerId: providerId,
		consumerId: consumerId,
		mutualAgreementId: mutualAgreementId,
		consumerReviewId: consumerReviewId,
		providerReviewId: providerReviewId,
		creationDate: creationDate
	});
};

/*
	document.save(function(err, document))
	document.findByIdAndRemove(_id, funciton(err, document))
	document.findByIdAndUpdate(id, { $set: { password: 'new_pwd' }}, function (err, document))
	document.findById(id, [projection], [options], [callback])
*/


// console.log(mongoose.Types.ObjectId('55ba5d111db22b507b052591').valueOf());
var TransactionDAO = mongoose.model("TransactionDAO", transactionDAOSchema);

module.exports = TransactionDAO;