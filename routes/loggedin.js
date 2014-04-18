var graph = require('fbgraph');

exports.view = function(req, res) {
	res.render('loggedin');
}

exports.userinfo = function(req, res){
    
    graph.get("/me", function(err, res) {
       //console.log(res);\
       var data  = [];
       data = res;
      //pass data off to view function    
       //res.render('loggedin', data);
    });
    //Return data to the webpage
    res.render('loggedin');
    
}