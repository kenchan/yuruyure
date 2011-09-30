var OAuth = require('oauth').OAuth;

var oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.CONSUMER_KEY,
  process.env.CONSUMER_SECRET,
  '1.0a',
  null,
  'HMAC-SHA1'
);

var request = oauth.get(
  'https://stream.twitter.com/1/statuses/filter.json?follow=' + process.env.FOLLOW_ID,
  process.env.ACCESS_TOKEN,
  process.env.ACCESS_TOKEN_SECRET
);

request.addListener('response', function (response) {
  response.setEncoding('utf8');
  response.addListener('data', function (chunk) {
    if (chunk.match(/^\s*$/)) {
      return;
    }
    var tweet = JSON.parse(chunk);
    oauth.post(
      'http://api.twitter.com/1/statuses/update.json',
      process.env.ACCESS_TOKEN,
      process.env.ACCESS_TOKEN_SECRET,
      { status: 'ゆれゆれ、はじまるよー！ http://twitter.com/' + tweet.user['screen_name'] + '/status/' + tweet.id_str },
      function(err, data) {
        err && console.log(err);
      }
    );
  });
});
request.end();
