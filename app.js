//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
//Facebook API
var graph = require('fbgraph'); 
//Twitter API
var twit = require('twit');

var dotenv = require('dotenv');
dotenv.load();

//Route files to load
var index = require('./routes/index');
var loggedin = require('./routes/loggedin');


//Key information for Facebook
var conf = {
    client_id:      '231469240376504'
  , client_secret:  'da9ba9f03fcb8d3bf262e9e9a2a08cb1'
  , scope:          'email, user_about_me, user_birthday, user_location'
  , redirect_uri:   'http://infinite-springs-3439.herokuapp.com/auth/facebook'
//  , redirect_uri:   'http://localhost:3000/auth/facebook'
};

/*
//Key information for Twitter
var confT = new twit({
    consumer_key:         'HOSKuM9rXuqd8MGlnqP5xbR8y'
  , consumer_secret:      'V06BmWT7psO7O2LHP0xtzKLPqk0OSgzIFYVqGg4YGgdURlKSLU'
  , access_token:         '2444800346-6itow6Vgy7dZtrwPp7CsqbUmCWn7NDoarDxkL2p'
  , access_token_secret:  'eotcYuJh37HhyuVvtDG2w0rRdsH3I3cZV8dyLHgit82Pi'
  //, redirect_uri:         'http://infinite-springs-3439.herokuapp.com/auth/twitter'
  , redirect_uri:         'http://localhost:3000/auth/twitter' 
})
*/

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//Routes
app.get('/', index.view);

app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
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
    res.redirect('/loggedin');
  });
});

/*
app.get('/auth/twitter', function(req, res){
    
    var twitA = confT.getOauthUrl({
        "consumer_key": confT.consumer_key
        , "consumer_secret": confT.consumer_secret    
        , "redirect_uri": confT.redirect_uri
    });
    
    //console.log(twitA);
    res.redirect('/loggedin');
});*/

app.get('/loggedin', loggedin.userinfo);

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});