var PostDAO = require('./../../model/dao/PostDAO.js');
var UserDAO = require('./../../model/dao/UserDAO.js');
var Converter = require('./../../model/Converter.js');
var util = require('./../util.js');
var Errors = require('./../Errors.js');
var PostEnum = require('./../Enum.js').PostEnum;

var UserBO = require('./UserBO.js');

 /*******************************Dummy Constructor**************************************/ 
function PostBO (postId, title, keywordsArray, description, authorId, byWho, isPurchased, isExpired, createdAt){
	// to make it independent to mongodb from here to views, _postId is a string
	// but it can always be transformed back to the ObjectId Object by ObjectId(_postId)
	// see http://docs.mongodb.org/manual/reference/object-id/
	this._postId = postId; // this is a String
	this._title = title;
	this._keywordsArray = keywordsArray;
	this._description = description;
	this._authorId = authorId;
	//this._expiryDate = expiryDate;
	//this._ongoingMutualAgreementIdArray = ongoingMutualAgreementIdArray;
	//this._pictureIdArray = pictureIdArray;
	//this._creationDate = TIMESTAMP...
	//this._googlePlaceId = googlePlaceId;
	//this._rating = rating;
	//this._totalNumReviews = totalNumReviews;
	this._byWho = byWho;
	this._isPurchased = isPurchased;
	this._isExpired = isExpired;
	this._createdAt = createdAt;
}

/*******************************Static Method**************************************/

PostBO.findPostById = function(postId, callback){
	PostDAO.findPostById(Converter.convertFromBOIdToDaoId(postId), function(err, postDAO) {
		var postBO = Converter.convertFromPostDAOtoPostBO(postDAO);
		callback(err, postBO);
	});
}

PostBO.findPostsByKeywordsArrayAndOption = function(fieldsString, keywordsArray, optionalDictionary, callback){
	PostDAO.findPostsByKeywordsArrayAndOption(fieldsString, keywordsArray, optionalDictionary, function(err, postDAOArray){
		var postBOArray = Converter.convertFromPostDAOArraytoPostBOArray(postDAOArray);
		callback(err, postBOArray);
	});
};

PostBO.findPostsByTitle = function(fieldsString, title, callback) {
	PostDAO.findPostsByTitle(fieldsString, title, function(err, postDAOArray){
		var postBOArray = Converter.convertFromPostDAOArraytoPostBOArray(postDAOArray);
		callback(err, postBOArray);
	});
};

// All is actually searching for matching substrings in title and description.
// Returns any full matches currently in title or description or both.
PostBO.findPostsByAll = function(fieldsString, title, callback) {
	PostDAO.findPostsByTitle(fieldsString, title, function(err, postDAOArray){
		var postBOArray = Converter.convertFromPostDAOArraytoPostBOArray(postDAOArray);
		callback(err, postBOArray);
	});
};

PostBO.findPosts = function(criteriaDictionary, resultSizeUpperBound, callback){
	PostDAO.findPosts(criteriaDictionary, resultSizeUpperBound, function(err, postDAOArray){
		var postBOArray = Converter.convertFromPostDAOArraytoPostBOArray(postDAOArray);
		callback(err, postBOArray);
	});
};

PostBO.findPostsWithPopulatedFields = function(fieldsString, criteriaDictionary, resultSizeUpperBound, callback){
	PostDAO.findPostsWithPopulatedFields(fieldsString, criteriaDictionary, resultSizeUpperBound, function(err, postDAOArray){
		var postBOArray = Converter.convertFromPostDAOArraytoPostBOArray(postDAOArray);
		callback(err, postBOArray);
	});
};


PostBO.findPostsByUser = function(fieldsString, userQuery, optionalDictionary, callback){
	PostDAO.findPostsWithUser(fieldsString, userQuery, optionalDictionary, function(err, postDAOArray){
		var postBOArray = Converter.convertFromPostDAOArraytoPostBOArray(postDAOArray);
		callback(err, postBOArray);
	});
};

// PostBO.findAllCommentsByPostId = function(postBOId, callback){
// 	var postDAOId = Converter.convertFromBOIdToDaoId(postBOId);
// 	PostDAO
// 		.findOne({_id: postDAOId})
// 		.populate('commentIdArray')
// 		.exec(function(err, postDAO){
// 			var commentBOArray = Converter.convertFromCommentDAOArraytoCommentBOArray(postDAO.commentIdArray);
// 			callback(err, commentBOArray);
// 		});
// };

/*******************************Instance Method**************************************/
PostBO.prototype.save = function(callback, authorId){
	var newPostDAO = Converter.convertFromPostBOtoPostDAO(this);
	newPostDAO.save(function(err, postDAO){
		var postBO = Converter.convertFromPostDAOtoPostBO(postDAO);
		if(postBO){
			//now this post is saved, we need update its author so that it remember which post he has created
			UserDAO.findById(authorId, function(err, userDAO){
				userDAO.postIdArray.push(postDAO);
				userDAO.save();
			});
		}
		callback(err, postBO);
	});
};

/*******************************Dummy Getters**************************************/
PostBO.prototype.getPostId = function(){
	return this._postId;
};

PostBO.prototype.getTitle = function(){
	return this._title;
};

PostBO.prototype.getKeywordsArray = function(){
	return this._keywordsArray;
};

PostBO.prototype.getDescription = function(){
	return this._description;
};

PostBO.prototype.getAuthorId = function(){
	return this._authorId;
};

PostBO.prototype.getByWho = function(){
	return this._byWho;
};

PostBO.prototype.getIsPurchased = function(){
	return this._isPurchased;
};

PostBO.prototype.getIsExpired = function(){
	return this._isExpired;
};

PostBO.prototype.getCommentIdArray = function(){
	// beaware this may be populated
	return this._commentIdArray;
};

PostBO.prototype.getCreatedAt = function(){
	return this._createdAt;
};
/*******************************Setters**************************************/

PostBO.prototype.setPostId = function(newPostId){
	this._postId = newPostId;
};

PostBO.prototype.setTitle = function(newTitle){
	if(util.validateEmptyAndSpaceString(newTitle)){
		this._title = newTitle;
	} else {
		throw new Errors.EmptyAndSpaceStringError('title');
	}
};

PostBO.prototype.setKeywordsArray = function(newKeywordsArray){
	this._keywordsArray = newKeywordsArray;
};

PostBO.prototype.setDescription = function(newDescription){
	if(util.validateEmptyAndSpaceString(newDescription)){
		this._description = newDescription;
	} else {
		throw new Errors.EmptyAndSpaceStringError('description');
	}
};

PostBO.prototype.setAuthorId = function(newAuthorId){
	if(util.validateEmptyAndSpaceString(newAuthorId)){
		this._authorId = newAuthorId;
	} else {
		throw new Errors.EmptyAndSpaceStringError('authorId');
	}
};

PostBO.prototype.setByWho = function(newByWho){
	PostEnum.validate(newByWho);
	this._newByWho = PostEnum[newByWho];
};

PostBO.prototype.setIsPurchased = function(newIsPurchased){
	PostEnum.validate(newIsPurchased);
	this._isPurchased = PostEnum[newIsPurchased];
};

PostBO.prototype.setIsExpired = function(newIsExpired){
	PostEnum.validate(newIsExpired);
	this._isExpired = PostEnum[newIsExpired];
};

PostBO.prototype.setCommentIdArray = function(newCommentIdArray){
	// beaware this may be populated
	this._commentIdArray = newCommentIdArray.slice();
};



PostBO.prototype.setCreatedAt = function(newCreatedAt){
	this._createdAt = newCreatedAt;
};


module.exports = PostBO;