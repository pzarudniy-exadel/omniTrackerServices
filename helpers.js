exports.userLogin = function(req, res, userProvider, errors){
    var login = req.body.login || "";
    userProvider.userExists(login, function(error, user){
        if(error){
            res.json(errors.loginError);
        }else{
            if(user){
                var password = req.body.password || "";
                userProvider.userLogin(login, password, function(error, user){
                    if(error){
                        res.json(errors.loginError);
                    }else{
                        if(user){
                            userId = user._id || "";
                            req.session.userId = userId;
                            res.json({ 'error' : false, 'message': 'Successfully logged in'});
                        }else{
                            res.json({ 'error' : true, 'message': 'Login error.'});
                        }
                    }
                });
            }else{
                res.json({ 'error' : false, 'message': 'User not exists'});
            }
        }
    });
}

exports.userShow = function(req, res, userProvider, errors){
    var userId = req.session.userId || "";

    if(userId){
        userProvider.findById(userId, function(error, user){
            if(error){
                res.json(errors.showError);
            }else{
                if(user){
                    res.json(user);
                }else{
                    res.json({ 'error' : true, 'message': 'You are not logged in or error on attempt get user data. Please re-login.'});
                }
            }
        });
    }else{
        res.json({ 'error' : true, 'message': 'You are not logged in or error on attempt get user data. Please re-login.'});
    }
}

exports.userLogout = function(req, res, errors){
    req.session.destroy(function(error){
        if(error){
            res.json({ 'error' : true, 'message': 'An error on attempt logout user.'});
        }else{
            res.json({ 'error' : false, 'message': 'Successfully logout.'});
        }
    });
}

exports.addComment = function(req, res, commentProvider, errors){
    // TODO check login in other helper
    var userId = req.session.userId || "";
    var comment = req.body.comment || "";
    // TODO issueId and check issue exists
    var issueId = req.body.issueId || "1";

    if(userId){
        // TODO user exists
        commentProvider.addComment(userId, comment, issueId, function(error){
            if(error){
                res.json({ 'error' : true, 'message': 'An error on attempt add comment.'});
            }else{
                res.json({ 'error' : false, 'message': 'Comment successfully added.'});
            }
        });
    }else{
        res.json({ 'error' : true, 'message': 'You are not logged in or error on attempt get user data. Please re-login.'});
    }
}

exports.getComments = function(req, res, commentProvider, issueId, errors){
    // TODO check issue exists
    commentProvider.getComments(issueId, function(error, comments){
       if(error){
           res.json({ 'error' : true, 'message': 'An error on attempt get comments.'});
       }else{
           if(comments){
               res.json(comments);
           }else{
               res.json({ 'message' : 'no comments'});
           }
       }
    });
}

exports.addIssue = function(req, res, issueProvider, errors){
    var userId = req.session.userId || "";

    var text = req.body.text || "";
    var severity = req.body.severity || "";
    var status = req.body.status || "";

    if(userId){
        // TODO user exists
        issueProvider.addIssue(userId, text, severity, status, function(error){
            if(error){
                res.json({ 'error' : true, 'message': 'An error on attempt add issue.'});
            }else{
                res.json({ 'error' : false, 'message': 'Issue successfully added.'});
            }
        });
    }else{
        res.json({ 'error' : true, 'message': 'You are not logged in or error on attempt get user data. Please re-login.'});
    }

}