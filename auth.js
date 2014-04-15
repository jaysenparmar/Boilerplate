//load environment variables
var dotenv = require('dotenv');
dotenv.load();

/**
* Add your authentication apis here with example like the bottom
*/

//Add Facebook API Setup
var graph = require('fbgraph');
graph.setAccessToken(access_token);
//Set Facebook AppID and AppSecret
graph.set('fb_app_id', process.env.facebook_app_id);
graph.set('fb_app_secret', process.env.facebook_app_secret);
//Export graph as a parameter to be used by other methods that require it
exports.graph = graph;

   // get authorization url
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
    });

    // shows dialog
    res.redirect(authUrl);

    // after user click, auth `code` will be set
    // we'll send that and get the access token
    graph.authorize({
        "client_id":      conf.client_id
      , "redirect_uri":   conf.redirect_uri
      , "client_secret":  conf.client_secret
      , "code":           req.query.code
    }, function (err, facebookRes) {
      res.redirect('/loggedIn');
    });

graph.get("zuck", function(err, res) {
  console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
});
//Add Twitter API Setup Here
//TODO

/** EXAMPLE **
//add instagram api setup
var ig = require('instagram-node-lib');
ig.set('client_id', process.env.instagram_client_id);
ig.set('client_secret', process.env.instagram_client_secret);

//export ig as a parameter to be used by other methods that require it.
exports.ig = ig;
**/