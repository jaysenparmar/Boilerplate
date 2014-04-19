//Facebook API
var graph = require('fbgraph'); 

//Key information for Facebook
var conf = {
    client_id:      '231469240376504'
  , client_secret:  'da9ba9f03fcb8d3bf262e9e9a2a08cb1'
  , scope:          'user_about_me, user_birthday, user_location, friends_relationships'
  //, redirect_uri:   'http://infinite-springs-3439.herokuapp.com/auth/facebook'
  , redirect_uri:   'http://localhost:3000/auth/facebook'
};

//Render View
exports.view = function(req, res) {
	res.render('fblogin');
}

//Facebook Authentication
exports.fbauth = function(req, res) {

  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });
      
    if (!req.query.error) {
      res.redirect(authUrl);
    } else {
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
        
}//end funct


//Access FB User Info
exports.fbinfo = function(req, res){
    
    graph.get("/me", function(err, res1) {
       //console.log(res1);
       res.render('fblogin', res1);
    });
    
}//end funct

//Access FB User's Friends
exports.fbfriends = function(req, res){

    graph.get("/me/friends?fields=name,gender,relationship_status", function(err, res1) {        
       var friends = [];
       var singles = [];
       friends = res1;
    
       //Push single people to single array
       for(var i = 0; i < friends.data.length; i++){
           if(friends.data[i].relationship_status=="Single"){
                singles.push(friends.data[i]);
           }
       }
        
       friends.data = singles;
       //console.log(singles);
       res.render('match', friends);
    });
    
}//end funct
