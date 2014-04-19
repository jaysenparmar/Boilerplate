//Twitter API
var twit = require('twit');

//Key information for Twitter
var confT = new twit({
    consumer_key: 'HOSKuM9rXuqd8MGlnqP5xbR8y'
  , consumer_secret: 'V06BmWT7psO7O2LHP0xtzKLPqk0OSgzIFYVqGg4YGgdURlKSLU'
  , access_token: '2444800346-6itow6Vgy7dZtrwPp7CsqbUmCWn7NDoarDxkL2p'
  , access_token_secret: 'eotcYuJh37HhyuVvtDG2w0rRdsH3I3cZV8dyLHgit82Pi'
})

//Render View
exports.view = function(req, res) {
	res.render('twitlogin');
}

//Access Twitter User Info
exports.twitinfo = function(req, res){
    confT.get('statuses/user_timeline', function(err, res1){
        console.log(res1);
        //res.send(res1);   
        var data = [];
        data = res1;
        console.log(data);
        /*
        var stream = T.stream('statuses/filter', { track: 'single' })

stream.on('tweet', function (tweet) {
  console.log(tweet)
})*/

        res.render('twitlogin', data[0]);
    });
}