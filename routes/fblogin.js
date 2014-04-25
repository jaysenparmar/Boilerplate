//Facebook API
var graph = require('fbgraph'); 

//Key information for Facebook
var conf = {
    client_id:      '231469240376504'
  , client_secret:  'da9ba9f03fcb8d3bf262e9e9a2a08cb1'
  , scope:          'user_about_me, user_birthday, user_location, user_likes, user_status, friends_relationships, friends_likes'
  //, redirect_uri:   'http://safe-beyond-4638.herokuapp.com/auth/facebook'
  //, redirect_uri:   'http://localhost:3000/auth/facebook'
    , redirect_uri:   'http://infinite-springs-3439.herokuapp.com/auth/facebook'
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
    
    graph.get("/me?fields=name,gender,birthday,location,likes,statuses, picture", function(err, res1) {
       //console.log(res1.likes.data[0].name);
        var mydata = [];
        var mylikes = [];
        var mystatuses = [];
        
        mydata = res1;
        
        for(var i = 0; i < mydata.likes.data.length; i++){
            //console.log(mydata.likes.data[i].name);
            mylikes.push(mydata.likes.data[i].name);        
        }
        //console.log(mylikes);
        res1.likes = mylikes;
        //console.log(res1.likes);
        
        //console.log(res1);
        for(var i = 0; i < mydata.statuses.data.length; i++){
            //console.log(mydata.likes.data[i].name);
            mystatuses.push(mydata.statuses.data[i].message);        
        }
        //console.log(mystatuses);
        res1.statuses = mystatuses;
        //console.log(res1.statuses);

       var picture = mydata.picture.data.url;
        
        res1.picture = picture;
        
        console.log(res1);
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
       //console.log(friends);
       res.render('match', friends);
    });
}

//Render Data
exports.fbdata = function(req,res){
  graph.get("/me/friends?fields=name,gender,relationship_status", function(err, res1) {        
       var friends = [];
       var numSingles = 0;
       var numSMales = 0;
       var numSFemales = 0;
       var numTMales = 0;
       var numTFemales = 0;
       var totalFriends = 0;
       friends = res1;
      
      //console.log(friends);
       //Push single people to single array
       for(var i = 0; i < friends.data.length; i++){
           totalFriends++;
           if(friends.data[i].relationship_status=="Single"){
               numSingles++;
               //if males, inc male ctr
               if(friends.data[i].gender == "male"){
                    numSMales++;
               }
               //if female, inc female ctr
               else if(friends.data[i].gender == "female"){
                    numSFemales++;
               }
           }
            else if(friends.data[i].relationship_status!="Single"){
                //if males, inc male ctr
               if(friends.data[i].gender == "male"){
                    numTMales++;
               }
               //if female, inc female ctr
               else if(friends.data[i].gender == "female"){
                    numTFemales++;
               }
                
            }
           }
      
       //Number of friends in a relationship
       var numTaken = totalFriends - numSingles;
 
      var data = 
          {
            "name": "Total Friends", "size": totalFriends,
              "children":[
                  {
                    "name":"Singles", "size": numSingles,
                    "children": [
                        { "name": "Males", "size": numSMales},
                        { "name": "Females", "size": numSFemales}
                    ]
                  },
                  {
                    "name":"Taken", "size": numTaken,
                    "children": [
                        { "name": "Males", "size": numTMales},
                        { "name": "Females", "size": numTFemales}
                    ]
                  }]
          };
                  
      //Push data to singles json obj.
      //console.log("Total Friends: " + totalFriends + ", Single Friends: " + numSingles + " M/F: " + numSMales + "/" +numSFemales+ ", Taken Friends: " + numTaken + " M/F: " + numTMales + "/" + numTFemales); 
      res.json(data);
    });
}
