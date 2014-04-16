var graph = require('fbgraph');

exports.view = function(req, res) {
	res.render('loggedin');
}

exports.info = function(req, res){ 
    graph.get("/me", function(err, res) {
  console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
});
    res.render('loggedin');
}