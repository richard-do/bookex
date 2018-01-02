var Enum = function() {
	this._names = [];
    for (var i in arguments) {
        this[arguments[i]] = i;
        this._names[i] = arguments[i];
    }
}
Enum.prototype.getName = function(i){
	return this._names[i];
};

Enum.prototype.validate = function(name){
	if (!this[name]){
		throw new Error(name + 'doesnt exist');//may need a class for this in Erros.js
	}
	return true;
}

/************************ PostDAO Enum *************************/
var PostEnum = new Enum('byConsumer', 'byProvider', 'isNotPurchased', 'isPurchased','isNotExpired', 'isExpired');

/************************ UserDAO Enum *************************/
var UserTypeEnum = new Enum('normal', 'admin');

/*************** Mutual Agreement Front End Enum ***************/

module.exports.PostEnum = PostEnum;
module.exports.UserTypeEnum = UserTypeEnum;
