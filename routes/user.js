
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){


    res.json(req.body);
};

exports.add = function(req, res){
    res.json({operation: "add"});
}

exports.show = function(req, res){
    console.log(req.session);
    res.json(req.session);
}