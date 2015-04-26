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

  agg('arbre', 'arrondissement').then(function(response){
    console.log(response);
   });

   res.redirect('back');
});

app.get('/arbres', function (req, res) {



  agg('arbre', 'arrondissement').then(function(response){
    

    var arr = {};
    var buckets = response.aggregations.arronds.buckets;



    console.log(response);
    for(var i in buckets){
      var arrond = buckets[i];
      arr[arrond.key.toUppercase()] = arrond.doc_count;

    }

    console.log(arr);

    res.send(200, arr);

   });
});

var search = function(indexParam, matchParam, toMatch){
  var matchObj = {};
  matchObj[matchParam] = toMatch;
  return client.search({
     index:indexParam,
     body: {
         query: {
            match: matchObj
         }
      }
   });
}


var agg = function(indexParam, toMatch, callback){
  return client.search({
     index:indexParam,
     search_type: "count",
     body: {
         aggregations: {
            "arronds":{
                terms: {
                field:toMatch
              }
            }
         }
      }
   });
}



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
