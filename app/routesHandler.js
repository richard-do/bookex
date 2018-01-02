var UserBO = require('./../control/businessObject/UserBO.js');
var PostBO = require('./../control/businessObject/PostBO.js');
var CommentBO = require('./../control/businessObject/CommentBO.js');
var util = require('./../control/util.js');
var PostEnum = require('./../control/Enum.js').PostEnum;
var UserTypeEnum = require('./../control/Enum.js').UserTypeEnum;
var GLOBAL_CONSTANTS = require('./../GLOBAL_CONSTANTS.js');
var Converter = require('./../model/Converter.js');

/**************************Home Page*************************************/
var renderHomePage = function(req, res){
	var userId = req.user._userId;
	UserBO.findAllPostBOsByUserId(userId, function(err, postBOArray){
		// find all the posts that this user has
		// construct the keyword set out of those posts
		var keywordsSet = new Set();
		for (var i = 0; i < postBOArray.length; i++) {
			var keywordsArray = postBOArray[i].getKeywordsArray();
			// chrome console output
			// b = new Set()
			// Set {}
			// Set.prototype.add.apply(b, [1,2,1]) #this line is the same as b.add.apply(b, [1,2,1])
			// Set {1}
			keywordsSet.add.apply(keywordsSet, keywordsArray);
		};
		// need to convert set to array now
		var keywordsArray = [];
		keywordsSet.forEach(function(keyword){
			keywordsArray.push(keyword);
		});

		// TODO: debug this: the provider one (currently set false to disable it) doesn't work correctly
		if(false/*keywordsArray.length > 0*/){
			var byProviderCriteriaDictionary = {
				$and:
				[
				{authorId: {$ne: userId}},
				{keywordsArray: {$in: keywordsArray}},
				{byWho: {$eq: PostEnum['byProvider']}},
				{isExpired: {$eq: PostEnum['isNotExpired']}}
				]
			};
			PostBO.findPostsWithPopulatedFields('commentIdArray', byProviderCriteriaDictionary, GLOBAL_CONSTANTS.MODEL.POST_DAO.HOME_PAGE_RECOMMENDATION_NUMBER, function(err, postBOArray){
				if(err){
					res.send(err);
					console.log('fails on finding recommended posts by provider\n ' + err);
					return;
				}
				var postBOByProviderArray = postBOArray;
				res.render('home.ejs', {
					user : req.user,
					postBOByProviderArray: postBOByProviderArray,
					PostEnum: PostEnum
				});
			});
		} else {
			// if i have time, show some posts that are most searched most of the time
			// if not, show random posts (right now just show any 5 posts)
			var criteriaDictionary = {
				$and:
				[
				{authorId: {$ne: userId}},
				{isExpired: {$eq: PostEnum['isNotExpired']}}
				]
			};
			PostBO.findPostsWithPopulatedFields('commentIdArray', criteriaDictionary, GLOBAL_CONSTANTS.MODEL.POST_DAO.HOME_PAGE_RECOMMENDATION_NUMBER, function(err, postBOArray){
				if(err){
					res.send(err);
					console.log('fails on finding recommended posts\n ' + err);
					return;
				}
				var postBOFeaturedArray = postBOArray;
				res.render('home.ejs', {
					user : req.user,
					postBOFeaturedArray: postBOFeaturedArray,
					PostEnum: PostEnum
				});
			});

		}

	});
};

/**************************Search Bar*************************************/
var keywordsSearchHandler = function(req, res){
	// for following part refer to home.ejs and Enum.js
	var optionalDictionary = {};
	// the for loop checks which radio button is turned on
	for (var i = GLOBAL_CONSTANTS.MODEL.POST_DAO.MULTIKEY_INDEX.length - 1; i >= 0; i--) {
		// so key = either "byWho", "isPurchased", "isExpired"
		var key = GLOBAL_CONSTANTS.MODEL.POST_DAO.MULTIKEY_INDEX[i];
		// Eg. key = "byWho", then req.body.post[key] = "byComsumer" or "byProvider"
		if(req.body.post[key]){
			// Eg. req.body.post[key] = "byComsumer", then PostEnum[req.body.post[key]] = 0 if By comsumer radio is checked
			optionalDictionary[key] = PostEnum[req.body.post[key]];
		}
	};
	
	// Get the search option specification from page
	var searchOption = req.body.searchOption;

	// Perform search and output results
	if(searchOption == "bySeller"){
		PostBO.findPostsByUser('commentIdArray', req.body.post.keywords, optionalDictionary, function(err, postBOArray){
			if(err){
				console.error(err);
			}
			else{
				res.render('postSearchResult.ejs', {
					user : req.user,
					postBOArray: postBOArray,
					PostEnum: PostEnum
				});
			}
		});
	} else if (searchOption == "byKeyword"){
		var keywordsArray = util.stringToArray(req.body.post.keywords);
		PostBO.findPostsByKeywordsArrayAndOption('commentIdArray', keywordsArray, optionalDictionary, function(err, postBOArray){
			if(err){
				console.error(err);
			}
			else{
				res.render('postSearchResult.ejs', {
					user : req.user,
					postBOArray: postBOArray,
					PostEnum: PostEnum
				});
			}
		});
	} else {
		var title = req.body.post.keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		if (searchOption == "byTitle") {		
			PostBO.findPostsByTitle('commentIdArray', title, function(err, postBOArray) {
				if(err){
					console.error(err);
				} 
				else{
					res.render('postSearchResult.ejs', {
						user : req.user,
						postBOArray: postBOArray,
						PostEnum: PostEnum
					});
				}
			});
		} else if (searchOption == "byAll") {
			PostBO.findPostsByAll('commentIdArray', title, function(err, postBOArray) {
				if(err){
					console.error(err);
				} 
				else{
					res.render('postSearchResult.ejs', {
						user : req.user,
						postBOArray: postBOArray,
						PostEnum: PostEnum
					});
				}
			});
		} else /* error */ {
			console.log("Search by no options is occurring! This is not intended... Yet!");
		}

	}
	
};

/**************************Submit a New Post*************************************/
var postFormHandler = function(req, res){
	var title = req.body.post.title;
	var description = req.body.post.description;
	var autherId = req.user._userId;

	var byWho = PostEnum[req.body.post.byWho];
	var isPurchased = PostEnum.isNotPurchased;
	var isExpired = PostEnum.isNotExpired;
	var createdAt = new Date().getTime();

	// format the array to handle odd spaces and commas
	var keywords = req.body.post.keywords;
	var keywordsArray = null;
	if (keywords != "") {
		keywords = keywords.replace(/,/g , " ");
		keywords = keywords.replace(/\s\s+/g, ' ');
		keywords = keywords.trim();
		keywordsArray = keywords.split(' ');
	}

	var newPostBO = new PostBO(Converter.generateBOId(), title, keywordsArray, description, autherId, byWho, isPurchased, isExpired, createdAt);
	newPostBO.save(function(err, postBO){
		if(err){
			console.log('Search error with PostBO.save');
			console.error(err);
		} else{
			if (postBO){
				res.render('postAfterSubmit.ejs', {
					user : req.user,
					postBO: postBO,
					PostEnum: PostEnum
				});
			} else {
				console.log('Somehow no error but didn\'t submit the Post!');
				res.send('Somehow no error but didn\'t submit the Post!');
			}
		}
	}, autherId);
};

/**************************Submit a New Comment*************************************/
var postCommentHandler = function(req, res){
	var commentId = Converter.generateBOId();
	var description = req.body.commentDescription;
	var authorId = req.body.commentAuthorId;
	var createdAt = new Date().getTime();
	var commentPostId = req.body.commentPostId;
	var newCommentBO = new CommentBO(commentId, description, authorId, createdAt);
	newCommentBO.save(function(err, commentBO){
		if(err){
			console.error(err);
		} else {
			if(commentBO){
				res.render('commentRender.ejs', {
					commentBO : commentBO
				});
			} else{
				console.log('Sending data to server ok, but cant save on mongo lab!');
				res.send('Sending data to server ok, but cant save on mongo lab!');
			}
		}

	}, commentPostId);
};

/**************************Edit User*************************************/
var changeUser = function(req, res){
	//res.send("changing user...");
	var userId = req.user._userId;
	var newPassword = req.body.password;
	UserBO.findByIdAndUpdate(userId, {$set: {password: newPassword}}, function(err, userBO){
		if(err){
			console.error(err);
			res.send(err);
		} else {
			if(userBO){
				res.render('profilePage.ejs', {
					user : userBO,
				});
			} else {
				console.log('Sending data to server ok, but cant save on mongo lab!');
				res.send('Sending data to server ok, but cant save on mongo lab!');
			}
		}
	});

}

/**************************Post Page*************************************/

var singlePostHandler = function(req, res, postId) {
	PostBO.findPostById(postId, function(err, postBO) {
		if (err) {
			console.error(err);
		} else {
			res.render('postAfterSubmit.ejs', {
				user : req.user,
				postBO : postBO,
				PostEnum : PostEnum
			})
		}
	});
}

/**************************General Helper*************************************/





/**************************Home Page*************************************/
module.exports.renderHomePage = renderHomePage;

/**************************Search Bar*************************************/
module.exports.keywordsSearchHandler = keywordsSearchHandler;

/**************************Change User*************************************/
module.exports.changeUser = changeUser;

/**************************Submit a New Post*************************************/
module.exports.postFormHandler = postFormHandler;

/**************************Submit a New Comment*************************************/
module.exports.postCommentHandler = postCommentHandler;
/**************************Post Page*************************************/
module.exports.singlePostHandler = singlePostHandler;
