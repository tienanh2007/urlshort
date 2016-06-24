var express = require("express")
var mongodb = require('mongodb');
var app = express()
var MongoClient = mongodb.MongoClient;
var url1 = 'mongodb://localhost:27017/my_database_name';
MongoClient.connect(url1, function (err, db) {
  if (err) throw err
  var collection = db.collection("food")
    collection.find({}).toArray(function(err, docs) {
      state.docs = docs
      db.close()
  })
})
var state = {
  docs: null
}
var temp = null
// app.get('/:url',function(req,res){
//   temp = state.docs.filter(function(doc){
//     return doc.name == req.params.url
//   })
//   var thing = {name:req.params.url,tasty: true}
//   if(temp.length == 0){
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err
//       var collection = db.collection("food")
//       collection.insert(thing)
//       collection.find({}).toArray(function(err, docs) {
//         state.docs = docs
//         db.close()
//       })
//     })
//   }
//   if(temp.length!=0){
//     thing = temp
//   }
//   res.send("use this" + JSON.stringify(thing))
// })
app.get("/",function(req,res){
  res.send(JSON.stringify(state.docs))
})
app.all("/new/*",function(req,res){
  var url = req.url.substring(5)
  var regex = /https?:\/\/(.+)/
  if(!regex.test(url)){
    res.send("false url")
  }
  else{
    var original = url.match(regex)[1]
    var shortUrl = original.split("").map(function(e){
      return e.charCodeAt(0)+""
    }).reduce(function(a,b){
      return a+b
    })
    temp = state.docs.filter(function(doc){
      return doc.name == url
    })
    var thing = {name:url,tasty: true}
    if(temp.length == 0){
      thing.tasty = shortUrl
      MongoClient.connect(url1, function (err, db) {
        if (err) throw err
        var collection = db.collection("food")
        collection.insert(thing)
        collection.find({}).toArray(function(err, docs) {
          state.docs = docs
          db.close()
        })
      })
    }
    else{
      thing = temp
    }
    res.send("use "+ JSON.stringify(thing))
  }
})
app.all("/go/*",function(req,res){
  var url = req.url.substring(4)
  temp = state.docs.filter(function(doc){
    return doc.tasty == url
  })
  if(temp.length == 0){
    res.send("invalid url")
  }
  else{
    res.redirect(temp[0].name)
  }
})
app.listen(process.env.PORT||3000,function(){
  console.log("listening on port")
})
