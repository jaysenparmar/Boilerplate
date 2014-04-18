//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();


var dotenv = require('dotenv');
dotenv.load();

//Route files to load
var index = require('./routes/index');
var fblogin = require('./routes/fblogin');
var twitlogin = require('./routes/twitlogin');

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//Routes
app.get('/', index.view);
app.post('/', index.view);

//Facebook Authentication and Information Methods
app.get('/auth/facebook', fblogin.fbauth);
app.get('/fblogin', fblogin.fbinfo);
app.get('/fblogin', fblogin.fbphoto);

//Twitter Information Methods
app.get('/auth/twitter', twitlogin.twitinfo);


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});