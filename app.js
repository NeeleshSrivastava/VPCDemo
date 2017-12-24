var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Redis = require('ioredis');
var redis = new Redis('redis://10.0.2.226:6379')
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'eponymmysqlserver.ckfgctchszxd.us-west-2.rds.amazonaws.com',
  user     : 'classicspecs',
  password : 'GolfOmelet89',
  database : 'eponym_qa_api_3'
});
var MongoClient = require('mongodb').MongoClient
var newDb = null

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        

var router = express.Router();
//home
router.get('/home', function(req, res) {
        console.log("Inside home route>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    res.json({ message: 'hooray! welcome to Demo API!' });   
});
//Mongo

router.get('/mongo', function(req, res) {
    var collection = newDb.collection('users');
    collection.find({}).toArray(function(err, docs) {
        if(err){
                console.log("error >>>>>>",err)
                res.status(500).json({error:err})
        }
            console.log("Found the following records");
            console.dir(docs);
            res.status(200).json({result:docs})
  });
   
});
//Mysql
router.get('/mysql', function(req, res) {
        connection.query('SELECT * FROM Persons', function (error, results, fields) {
     if (error){
        console.log("error >>>.",error)
        res.status(500).json({error:error})
     }
     console.log('The solution is: ', results);
     res.status(200).json({result:results})
   });
});



//Redis
router.get('/redis', function(req, res) {
        redis.get('name', function (err, result) {

               	if(err){
                        console.log("error",err)
                        res.status(500).json({error:err})
                }
                console.log("Result from Redis",result);
                res.status(200).json({result:result})
        });
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected to Mysql Server as id ' + connection.threadId);
});
MongoClient.connect('mongodb://10.0.2.36:27017', function(err, db) {
    console.log("Connected correctly to Mongo server")
        newDb = db.db('eponym')
})


