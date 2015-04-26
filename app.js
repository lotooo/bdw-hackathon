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


app.get('/hello', function (req, res) {
  //adsdasdasd

   client.count({
     index:'lieuxculturels',
     body: {
         query: {
            match: {
               arrondissement: 'Ahuntsic-Cartierville'
            }
         }
      }
   }, function (err, response) {
     console.log(response)
   });

   count('lieuxculturels', 'arrondissement', 'Verdun', function(err, response){
     console.log(response)
   });

   // client.count({
   //   index:'lieuxculturels',
   //   body: {
   //       query: {
   //          match: {
   //             arrondissement: 'Verdun'
   //          }
   //       }
   //    }
   // }, function (err, response) {
   //   console.log(response)
   // });

   res.redirect('back');
});

var count = function(indexParam, matchParam, toMatch, callback){
  return client.count({
     index:indexParam,
     body: {
         query: {
            match: {
               matchParam: toMatch
            }
         }
      }
   }, callback);
}



var server = app.listen(3000, function () {

});
