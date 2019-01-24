var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});
var countConnect =0;
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   countConnect++;
   console.log("User connected: ", countConnect);
   socket.on('setUserPass', function(data){
      checkorinsertRow(data);
      console.log("Tai sao vo day vay ne");
   })

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      countConnect--;
      console.log("User disconnected: ", countConnect);
   })
});

http.listen(3000, function() {
   console.log('listening on *:3000');
});



// MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function cong(a, b){
   return a+b;
}
/** 
 * Function: CheckorInsertRow
 * return: 0 : not found, created data
 *         1 : Complete
 *         2 : Uncomplete
 * 
*/
function checkorinsertRow(data){
   var res =110;
   MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = {name: data.name};
      dbo.collection("User").find(query).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        if(result.length==0){
           insertOneRow(data.name, data.pass);
           console.log("Not fount, Created data");
           res = -1;
        }
        else{
           if(data.name==result[0].name && data.pass==result[0].pass){
              console.log("Complete");
              res = 1;
           }
           else{
              console.log("UnComplete");
              res = 0;
           }
        }
      });
    });
}
function insertOneRow(username, password){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbo = db.db("mydb");
        var myobj = {name:username, pass: password};
        dbo.collection("User").insertOne(myobj, function(err, res){
            if(err) throw err;
            console.log("1 document inserted ne");
            db.close();
        });
    })
}

function deleteId(id){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbo = db.db("mydb");
        var myobj = {id:id};
        dbo.collection("userpass").deleteOne(myobj, function(err, res){
            if(err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    })
}
function updateOneRow(old_id, id, username, password){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = { id: old_id};
        var newvalues = { $set: {id:id, name: username, pass: password} };
        dbo.collection("userpass").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      }); 
}
function findOneRow(id){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = {name:id};
        dbo.collection("userpass").findOne(myquery, function(err, result) {
          if (err){
              console.log("toan");
              throw err;
          }
          console.log(result.name);
          db.close();
        });
      });
}

function queryOneRow(name){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = {name: name};
        dbo.collection("User").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          return result.length;
        });
      });
   return -1;
}
function queryOneRowwithName(name){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = {name: name};
        dbo.collection("userpass").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result[0].name);
          db.close();
          return result.length;
        });
      });
   return -1;
}
