var elasticsearch = require('elasticsearch');
var express = require('express');
var app = express();

app.use(express.static(__dirname));

var client = new elasticsearch.Client({
  host: '74.121.245.248:9200'
});

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/bicycles', function (req, res) {

  agg('support_velo', 'arrondissement').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});

app.get('/arbres', function (req, res) {

  agg('arbre', 'arrondissement').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});

app.get('/pompiers', function (req, res) {

  agg('matt-pompiers', 'arrondissement').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});

app.get('/policiers', function (req, res) {

  agg('matt-polices', 'arrondissement').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});

app.get('/eaux', function (req, res) {

  agg('matt-eaux', 'arrondissement').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});

app.get('/bixis', function (req, res) {

  agg('matt-bixi', 'arrondissement').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});

app.get('/familles', function (req, res) {

  agg('matt-famille', 'arrondissement').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});

app.get('/patinoires', function (req, res) {

  agg('matt-patinoires', 'arr').then(function(response){
    
    var mapped = mapToAbbr(response.aggregations.arronds.buckets);

    res.send(200, mapped);

   });
});


var mapToAbbr = function (buckets){
    var arr = {};
    for(var i in buckets){
      var arrond = buckets[i];
      arr[arrond.key.toUpperCase()] = arrond.doc_count;
    }
    return [arr];
}


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
