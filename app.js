
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , errors = require('./errors')
  , helpers = require('./helpers');

var DataProvider = require('./dataProviders').DataProvider;


var dataProvider = new DataProvider('localhost', 27017);
var userProvider = dataProvider.UserProvider;
var commentProvider = dataProvider.CommentProvider;
var issueProvider = dataProvider.IssueProvider;

/*userProvider.save([{ login: "bob", name: "Bob", password: "123"}], function(err, users){
    console.log(err);
    console.log(users);
});*/

userProvider.findAll(function(err, doc){
    console.log(err);
    console.log(doc);
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: "secret"}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/user/login', function(req, res, next){
    helpers.userLogin(req, res, userProvider, errors);
});

app.get('/user/show', function(req, res, next){
    helpers.userShow(req, res, userProvider, errors);
});

app.get('/user/logout', function(req, res){
    helpers.userLogout(req, res, errors);
});

app.post('/addComment', function(req, res, next){
    helpers.addComment(req, res, commentProvider, errors);
});

app.get('/comments/:issueId', function(req, res, next){
    var issueId = req.params.issueId || "";
    helpers.getComments(req, res, commentProvider, issueId, errors);
});

app.post('/addIssue', function(req, res, next){
    helpers.addIssue(req, res, issueProvider, errors);
});

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/user/login', user.login);
app.post('/user/add', user.add);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
