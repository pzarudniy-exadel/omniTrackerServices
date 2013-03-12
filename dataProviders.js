var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var crypto = require('crypto');


// TODO dataProvider and split to other providers.
DataProvider = function(host, port) {
    this.db = new Db('omniTrack', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){});
    this.UserProvider = new UserProvider(this.db);
    this.CommentProvider = new CommentProvider(this.db);
    this.IssueProvider = new IssueProvider(this.db);
};

UserProvider = function(db){
    this.db = db;
}

UserProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, user_collection) {
    if( error ) callback(error);
    else callback(null, user_collection);
  });
};

UserProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

UserProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

UserProvider.prototype.save = function(login, password, name, avatar, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
          var userToAdd = {};
          //TODO check all fields
          userToAdd.name = name;
          userToAdd.login = login;
          userToAdd.password = crypto.createHash('md5').update(password).digest("hex");
          userToAdd.create_at = new Date();
          userToAdd.avatar = avatar;
          user_collection.insert(userToAdd, function(user) {
            callback(null, user);
          });
      }
    });
};

UserProvider.prototype.userExists = function(login, callback){
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({login: login}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
}

UserProvider.prototype.userLogin = function(login, password, callback){
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        //TODO uncomment to hash password
        //password = crypto.createHash('md5').update(password).digest("hex");
        user_collection.findOne({login: login, password: password}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
}


CommentProvider = function(db){
    this.db = db;
}

CommentProvider.prototype.getCollection= function(callback) {
  this.db.collection('comments', function(error, comment_collection) {
    if( error ) callback(error);
    else callback(null, comment_collection);
  });
};

CommentProvider.prototype.addComment = function(userId, comment, issueId, callback) {
    this.getCollection(function(error, comment_collection) {
      if( error ) callback(error)
      else {
          // TODO check type
          //if( typeof(users)=="string")
          var commentToAdd = {};
          commentToAdd.text = comment;
          commentToAdd.create_at = new Date();
          //TODO check user exists, issue exists
          commentToAdd.userId = userId;
          commentToAdd.issueId = issueId;
          commentToAdd.deleted = false;

          comment_collection.insert(commentToAdd, function(comment) {
            callback(null, comment);
          });
      }
    });
};

CommentProvider.prototype.getComments = function(issueId, callback, showDeleted) {
    var isShowDeleted = showDeleted || false;

    this.getCollection(function(error, comment_collection) {
       if(error) callback(error)
        else{
           //TODO check issue exists
            comment_collection.find({ 'issueId' : issueId, 'deleted' : isShowDeleted}, {'sort' : 'create_at'}).toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
       }
    });
}

IssueProvider = function(db){
    this.db = db;
}

IssueProvider.prototype.getCollection= function(callback) {
  this.db.collection('issues', function(error, issue_collection) {
    if( error ) callback(error);
    else callback(null, issue_collection);
  });
};

IssueProvider.prototype.addIssue = function(userId, text, severity, status, callback) {
    this.getCollection(function(error, issue_collection) {
      if( error ) callback(error)
      else {
          // TODO check type
          //if( typeof(users)=="string")
          var issueToAdd = {};
          issueToAdd.text = text;
          issueToAdd.create_at = new Date();
          issueToAdd.update_at = new Date();
          //TODO check user exists, issue exists
          issueToAdd.userId = userId;
          issueToAdd.comments = [];
          issueToAdd.views = 0;
          issueToAdd.follows = 0;
          issueToAdd.deleted = false;

          issue_collection.insert(issueToAdd, function(issue) {
            callback(null, issue);
          });
      }
    });
};

IssueProvider.prototype.getAll = function(callback){
    this.getCollection(function(error, issue_collection) {
        if(error) callback(error)
        else{
            
        }
    });
};

exports.DataProvider = DataProvider;



