//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
var graph = require('fbgraph');

//route files to load
var index = require('./routes/index');
var facebook = require('./routes/auth/facebook');
var loggedin = require('./routes/loggedin');

//Place in .env file and change conf. to process.env
/*
var conf = {
    client_id:      '231469240376504'
  , client_secret:  'da9ba9f03fcb8d3bf262e9e9a2a08cb1'
  , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
  , redirect_uri:   'localhost:3000/auth/facebook'
};
*/

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());


//view files
app.get('/', index.view);
app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
   //Facebook authentication using Oauth
	var authUrl = graph.getOauthUrl({
	  "client_id": process.env.client_id
	, "redirect_uri": process.env.redirect_uri //change this to heroku website later in .env
	, "scope": 'email, user_location'
	});


    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
 graph.authorize({
	  "client_id": process.env.client_id
	, "redirect_uri": process.env.redirect_uri
	, "client_secret": process.env.client_secret
	, "code": req.query.code
 }, function(err, facebookRes) {
	res.redirect('/loggedin');
 });

});

app.get('/loggedin', loggedin.view);

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
