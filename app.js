var elasticsearch = require('elasticsearch');
var express = require('express');
var app = express();

app.use(express.static(__dirname));

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

app.get('/', function (req, res) {
  res.sendFile('index.html');
});


app.get('/hello', function (req, res) {

  count('arbre', 'arrondissement', 'AC', function(err, response){
     console.log(response)
   });

  count('lieuxculturels', 'arrondissement', 'Verdun', function(err, response){
     console.log(response)
   });

   res.redirect('back');
});

var count = function(indexParam, matchParam, toMatch, callback){

  var matchObj = {};
  matchObj[matchParam] = toMatch;

  return client.count({
     index:indexParam,
     body: {
         query: {
            match: matchObj
         }
      }
   }, callback);
}



var server = app.listen(3000, function () {
  console.log("Listening on port 3000");
});
