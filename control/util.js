var stringToArray = function(s){
	return s.split(" ").filter(Boolean);
}

var validateEmptyAndSpaceString = function(s){
	return s && s.trim();
}

module.exports.stringToArray = stringToArray;
module.exports.validateEmptyAndSpaceString = validateEmptyAndSpaceString;