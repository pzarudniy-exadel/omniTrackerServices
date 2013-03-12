
exports.loginError = function(){
    return { 'error' : true, message: 'An error on attempt login' };
}

exports.showError = function(){
    return { 'error' : true, message: 'An error on attempt show user' };
}