/***************************************MODEL CONSTANTS**********************************************/
var model = {};
model.DATABASE_URI = "mongodb://something:aboutyou@ds125060.mlab.com:25060/utmbookex";

	//TABLE NAME
model.TABLE_NAME = {};
model.TABLE_NAME.USER = "User";
model.TABLE_NAME.POST = "Post";
model.TABLE_NAME.COMMENT = "Comment";
model.TABLE_NAME.TEST = "Test";

model.POST_DAO = {};
model.POST_DAO.SEARCH_RESULT_NUMBER = 10;
model.POST_DAO.HOME_PAGE_RECOMMENDATION_NUMBER = 5;
model.POST_DAO.MULTIKEY_INDEX = ["byWho", "isPurchased", "isExpired"];

/***************************************CONTROL CONSTANTS**********************************************/
// module.exports.CONTROL = {};


/***************************************VIEW CONSTANTS**********************************************/
// module.exports.VIEW = {};





module.exports.MODEL = model;