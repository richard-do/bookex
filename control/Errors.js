// Inherit from Error class, this is not supported by all browser but is in chrome
function EmptyAndSpaceStringError(varName){
	Error.call(this, varName + 'can not be empty or just spaces.');
}

EmptyAndSpaceStringError.prototype = Object.create(Error.prototype);

// funciton EnumDoesntExistError(name){
	
// }

module.exports.EmptyAndSpaceStringError = EmptyAndSpaceStringError;