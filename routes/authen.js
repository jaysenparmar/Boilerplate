//load environment variables
var dotenv = require('dotenv');
dotenv.load();
var graph = require('fbgraph');

//Authenticate Facebook User
exports.login = function(req, res) {

  console.log("Calling authen.js->login");
  var graph = require('fbgraph');
  console.log(graph);

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
   //Facebook authentication using Oauth
	var authUrl = graph.getOauthUrl({
	  "client_id": conf.client_id
	, "redirect_uri": conf.redirect_uri //change this to heroku website later in .env
	, "scope": 'email, user_location, publish_stream'
	});

	console.log("AuthURL:" + authUrl.client_id);
	res.redirect('/loggedin');
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
	  "client_id": conf.client_id
	, "redirect_uri": conf.redirect_uri
	, "client_secret": conf.client_secret
	, "code": req.query.code
 }, function(err, facebookRes) {
	res.redirect('/loggedin');
 });

};
//Add Twitter API Setup Here
//TODO
