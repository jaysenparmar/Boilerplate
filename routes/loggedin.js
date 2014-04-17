var graph = require('fbgraph');
var data = {};

exports.view = function(req, res) {
	res.render('loggedin');
}

exports.userinfo = function(req, res){ 
    graph.get("/me", function(err, res) {
    //Store user data after stringfying it
    data = res;
    //Log returned data
    console.log(data);
    //res.render('loggedin', data);
    });
    //Return data to the webpage
    res.render('loggedin', data);
}