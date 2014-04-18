//Facebook API
var graph = require('fbgraph'); 

//Key information for Facebook
var conf = {
    client_id:      '231469240376504'
  , client_secret:  'da9ba9f03fcb8d3bf262e9e9a2a08cb1'
  , scope:          'email, user_about_me, user_birthday, user_location'
  //, redirect_uri:   'http://infinite-springs-3439.herokuapp.com/auth/facebook'
  , redirect_uri:   'http://localhost:3000/auth/facebook'
};

//Render View
exports.view = function(req, res) {
	res.render('fblogin');
}


exports.fbauth = function(req, res) {

  // Redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
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
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/fblogin');
  });
}


//Access user info
exports.fbinfo = function(req, res){
    
    graph.get("/me", function(err, response) {
       console.log(response);
       //var data  = [];
       //data = res;
      //pass data off to view function    
       res.render('fblogin',response);
    });
    
}