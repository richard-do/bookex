var UserDAO = require('./dao/UserDAO.js');
var PostDAO = require('./dao/PostDAO.js');
var CommentDAO = require('./dao/CommentDAO.js');

var UserBO = require('./../control/businessObject/UserBO.js');
var PostBO = require('./../control/businessObject/PostBO.js');
var CommentBO = require('./../control/businessObject/CommentBO.js');
// see http://docs.mongodb.org/manual/reference/object-id/
var ObjectId = require('mongoose').Types.ObjectId;

/************************ Id *************************/
var generateBOId = function(){
	return ObjectId().valueOf();
};

var convertFromDAOIdToBOId =  function(daoId){
	return daoId.valueOf();
};

var convertFromDAOIdArrayToBOIdArray = function(daoIdArray){
	var boIdArray = [];
	for(var i = 0; i < daoIdArray.length; i++){
		boIdArray.push(convertFromDAOIdToBOId(daoIdArray[i]));
	}
	return boIdArray;
};

var convertFromBOIdToDaoId = function(boId){
	return ObjectId(boId);
};

var convertFromBOIdArrayToDaoIdArray = function(boIdArray){
	var daoIdArray = [];
	for(var i = 0; i < boIdArray.length; i++){
		daoIdArray.push(convertFromBOIdToDaoId(boIdArray[i]));
	}
	return daoIdArray;
};
/************************ User *************************/
var convertFromUserBOtoUserDAO = function(userBO){
	if(userBO === null){
		return null;
	}
	var userDAO = UserDAO.create(userBO.getUserId(), userBO.getPassword(), 
		userBO.getFacebookId(), userBO.getName(), userBO.getUserIdType());
		/*, 
		userBO.getCircleIdArray(),  
		userBO.getReviewIdArrayAreOngoing(), 
		userBO.getPostIdArrayNotExpired(), 
		userBO.getPostIdArrayExpired()
		*/
	if(userBO.getPostIdArray() && userBO.getPostIdArray().length > 0){
		userDAO.postIdArray.push.apply(userDAO.postIdArray, convertFromBOIdArrayToDaoIdArray(userBO.getPostIdArray()));
	}
	return userDAO;
};

//Somehow this function doesnt work we don't know how to fix this
var convertFromUserDAOtoUserBO = function(userDAO){
	if(userDAO === null){
		return null;
	}
	else if(userDAO === undefined){
		console.log("userDAO is undefined");
		return;
	}
	var userBO = new UserBO(userDAO._id, userDAO.password, userDAO.facebookId, userDAO.name, userDAO.userIdType, userDAO.rating);
	if(userDAO.postIdArray && userDAO.postIdArray.length > 0){
		userBO.setPostIdArray(convertFromDAOIdArrayToBOIdArray(userDAO.postIdArray));	
	}
	return userBO;
};

/************************ Post *************************/
var convertFromPostBOtoPostDAO = function(postBO){
	if(postBO === null){
		return null;
	}
	var postDAO = PostDAO.create(convertFromBOIdToDaoId(postBO.getPostId()), postBO.getTitle(), postBO.getKeywordsArray(), postBO.getDescription(), postBO.getAuthorId(), postBO.getByWho(), postBO.getIsPurchased(), postBO.getIsExpired(), postBO.getCreatedAt());
	if (postBO.getCommentIdArray() && postBO.getCommentIdArray().length > 0){
		if (typeof postBO.getCommentIdArray()[0] === 'string' || postBO.getCommentIdArray()[0] instanceof String){
			postDAO.commentIdArray.push.apply(postDAO.commentIdArray, convertFromBOIdArrayToDaoIdArray(postBO.getCommentIdArray()));	
		} else if (postBO.getCommentIdArray()[0] instanceof CommentBO){
			// this array is populated by mongoose, it is holding objects not id
			// so here we compressed the dao object array back to the reference array
			for (var i = 0; i < postBO.getCommentIdArray().length; i++) {
				postDAO.commentIdArray.push(convertFromBOIdToDaoId(postBO.getCommentIdArray()[i].getCommentId()))
			};
		}
	}
	return postDAO;
};

var convertFromPostDAOtoPostBO = function(postDAO){
	if(postDAO === null){
		return null;
	}
	var postBO = new PostBO(convertFromDAOIdToBOId(postDAO._id), postDAO.title, postDAO.keywordsArray, postDAO.description, postDAO.authorId, postDAO.byWho, postDAO.isPurchased, postDAO.isExpired, postDAO.createdAt);
	if(postDAO.commentIdArray && postDAO.commentIdArray.length > 0){
		if (typeof postDAO.commentIdArray[0] === 'string' || postDAO.commentIdArray[0] instanceof String){
			postBO.setCommentIdArray(convertFromDAOIdArrayToBOIdArray(postDAO.commentIdArray));	
		} else if(postDAO.commentIdArray[0] instanceof CommentDAO){
			// this array is populated by mongoose, it is holding objects not id
			// so here we convert from one dao object array to bo object array
			postBO.setCommentIdArray(convertFromCommentDAOArraytoCommentBOArray(postDAO.commentIdArray));
		}
	}
	return postBO;
};

var convertFromPostBOArraytoPostDAOArray = function(postBOArray){
	var postDAOArray = [];
	for (var i = 0; i < postBOArray.length; i++) {
		postDAOArray.push(convertFromPostBOtoPostDAO(postBOArray[i]));
	};
	return postDAOArray;
};

var convertFromPostDAOArraytoPostBOArray = function(postDAOArray){
	var postBOArray = [];
	for (var i = 0; i < postDAOArray.length; i++) {
		postBOArray.push(convertFromPostDAOtoPostBO(postDAOArray[i]));
	};
	return postBOArray;
};


/************************ Comment *************************/
var convertFromCommentDAOtoCommentBO = function(commentDAO){
	if (commentDAO === null){
		return null;
	}
	var commentBO = new CommentBO(convertFromDAOIdToBOId(commentDAO._id), commentDAO.description, commentDAO.authorId, commentDAO.createdAt);
	return commentBO;
};

var convertFromCommentDAOArraytoCommentBOArray = function(commentDAOArray){
	var commentBOArray = [];
	for (var i = 0; i < commentDAOArray.length; i++) {
		commentBOArray.push(convertFromCommentDAOtoCommentBO(commentDAOArray[i]));
	};
	return commentBOArray;
};

var convertFromeCommentBOtoCommentDAO = function(commentBO){
	if (commentBO === null){
		return null;
	}
	var commentDAO = CommentDAO.create(convertFromBOIdToDaoId(commentBO.getCommentId()), commentBO.getDescription(), commentBO.getAuthorId(), commentBO.getCreatedAt());
	return commentDAO;
};

var convertFromCommentBOArraytoCommentDAOArray = function(commentBOArray){
	var commentDAOArray = [];
	for (var i = 0; i < commentBOArray.length; i++) {
		commentDAOArray.push(convertFromeCommentBOtoCommentDAO(commentBOArray[i]));
	};
	return commentDAOArray;
};


var convertFromUnixTimestamptoDateObj = function(UnixTimestamp){
	if (!UnixTimestamp) {
		return null;
	}
	return new Date(UnixTimestamp * 1000);
}

/************************ Id *************************/
module.exports.generateBOId = generateBOId;
module.exports.convertFromDAOIdToBOId = convertFromDAOIdToBOId;
module.exports.convertFromDAOIdArrayToBOIdArray = convertFromDAOIdArrayToBOIdArray;
module.exports.convertFromBOIdToDaoId = convertFromBOIdToDaoId;
module.exports.convertFromBOIdArrayToDaoIdArray = convertFromBOIdArrayToDaoIdArray;

/************************ User *************************/
module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;
module.exports.convertFromUserDAOtoUserBO = convertFromUserDAOtoUserBO; //Somehow this function doesnt work we don't know how to fix this

/************************ Post *************************/
module.exports.convertFromPostBOtoPostDAO = convertFromPostBOtoPostDAO;
module.exports.convertFromPostDAOtoPostBO = convertFromPostDAOtoPostBO;
module.exports.convertFromPostBOArraytoPostDAOArray = convertFromPostBOArraytoPostDAOArray;
module.exports.convertFromPostDAOArraytoPostBOArray = convertFromPostDAOArraytoPostBOArray;

/************************ Comment *************************/
module.exports.convertFromCommentDAOtoCommentBO = convertFromCommentDAOtoCommentBO;
module.exports.convertFromeCommentBOtoCommentDAO = convertFromeCommentBOtoCommentDAO;
module.exports.convertFromCommentDAOArraytoCommentBOArray = convertFromCommentDAOArraytoCommentBOArray;
module.exports.convertFromCommentBOArraytoCommentDAOArray = convertFromCommentBOArraytoCommentDAOArray;
/************************ Unix Timestamp *************************/
module.exports.convertFromUnixTimestamptoDateObj = convertFromUnixTimestamptoDateObj;
