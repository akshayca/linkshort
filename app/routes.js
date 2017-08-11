
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = "mongodb://jordan:mack@ds149551.mlab.com:49551/fcc-backend"
var short;
var long;

module.exports = function(app){

app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    });

  
app.route('/:query')
  .get(function(req, res){
  var query = req.params.query;
  var url2 = "https://mack-url-shortener.glitch.me/" + query;
  MongoClient.connect(url, function(err, db){
    if(err) throw err
    var collection = db.collection('short-urls');
    var cursor = collection.find( { "short-URL": url2 } );
    
    cursor.toArray(function(err, docs){
      if (docs.length == 0){
        res.send("Not a valid path");
      }
      else {
        
        //force browser to open corresponding long url (original url)
        //res.send(docs[0]['short-URL']);
        res.redirect(301, docs[0]['real-URL']);
      }
    });
    
    
  });
  
});


app.route('/https://:url')
    .get(function(req, res) {
      long = 'https://'+req.params.url;
      if (validateURL(long)){
        //use database.js call function and pass query as argument
        MongoClient.connect(url, function(err, db){
          if(err) throw err
          var collection = db.collection('short-urls');
          var cursor = collection.find( { "real-URL": long } );
          
          cursor.toArray(function(err, docs){
            if(docs.length == 0) {
              collection.count({}, function(err,count){
                
                short = "https://mack-url-shortener.glitch.me/"+(count+1);
                collection.insert( {"real-URL": long, "short-URL": short} );
                var json = {
                "Original URL": long,
                "Short URL": short
              }
             res.send(json);
            db.close();
              });
              
            }
            else {
              short = docs[0]['short-URL'];
              var json = {
                "Original URL": long,
                "Short URL": short
              }
               res.send(json);
              db.close();
            }
             
          });
        });
      }
      else{
        res.send("Not a valid URL")
      }
})
  
  app.route('/http://:url')
    .get(function(req, res) {
      long = 'http://'+req.params.url;
      if (validateURL(long)){
        //use database.js call function and pass query as argument
        MongoClient.connect(url, function(err, db){
          if(err) throw err
          var collection = db.collection('short-urls');
          var cursor = collection.find( { "real-URL": long } );
          
          cursor.toArray(function(err, docs){
            if(docs.length == 0) {
              collection.count({}, function(err,count){
                
                short = "https://mack-url-shortener.glitch.me/"+(count+1);
                collection.insert( {"real-URL": long, "short-URL": short} );
                var json = {
                "Original URL": long,
                "Short URL": short
              }
             res.send(json);
            db.close();
              });
              
            }
            else {
              short = docs[0]['short-URL'];
              var json = {
                "Original URL": long,
                "Short URL": short
              }
               res.send(json);
              db.close();
            }
             
          });
        });
      }
      else{
        res.send("Not a valid URL")
      }
})
  
  function validateURL(url) {
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }
  
  
  
}