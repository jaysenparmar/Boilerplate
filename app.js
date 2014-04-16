//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var graph = require('fbgraph'); //fb api
var app = express();
var dotenv = require('dotenv');
dotenv.load();

//route files to load
var index = require('./routes/index');
var loggedin = require('./routes/loggedin');


// this should really be in a config file!

var conf = {
    client_id:      '231469240376504'
  , client_secret:  'da9ba9f03fcb8d3bf262e9e9a2a08cb1'
  , scope:          'email, user_about_me, user_birthday, user_location'
  , redirect_uri:   'http://infinite-springs-3439.herokuapp.com/auth/facebook'
};

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//routes
app.get('/', index.view);
app.get('/loggedin', loggedin.info);

// Routes

app.get('/', function(req, res){
  res.render("index", { title: "click link to connect" });
});

app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });
      
    var cid = conf.scope;
    console.log(cid);

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
//app.get('loggedin', loggedin.info);
    res.redirect('/loggedin');
  });


});

app.get('loggedin', loggedin.info);

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});