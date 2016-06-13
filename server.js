var express = require("express")
var mongodb = require('mongodb');
var app = express()
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/my_database_name';
MongoClient.connect(url, function (err, db) {
  if (err) throw err
  var collection = db.collection("foods")
    collection.find({}).toArray(function(err, docs) {
      state.docs = docs
      db.close()
  })
})
var state = {
  docs: null
}
var temp = null
app.get('/http:\//:url',function(req,res){
  temp = state.docs.filter(function(doc){
    return doc.name == req.params.url
  })
  var thing = {name:req.params.url,tasty: true}
  if(temp.length == 0){
    var regex = /^([a-zA-Z0-9]+).([a-zA-Z0-9]+)\//
    var original = req.params.url.match(regex)[1]+req.params.url.match(regex)[2]
    var shortUrl = original.split("").map(function(e){
      return e.charCodeAt(0)+""
    }).reduce(function(a,b){
      return a+b
    })
    thing.tasty = shortUrl
    MongoClient.connect(url, function (err, db) {
      if (err) throw err
      var collection = db.collection("foods")
      collection.insert(thing)
      collection.find({}).toArray(function(err, docs) {
        state.docs = docs
        db.close()
      })
    })
  }
  if(temp.length!=0){
    thing = temp
  }
  res.send("use this" + JSON.stringify(thing))
})
app.get("/",function(req,res){
  res.send(JSON.stringify(state.docs))
})
app.listen(process.env.PORT||3000,function(){
  console.log("listening on port")
})
