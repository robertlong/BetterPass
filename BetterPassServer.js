var express = require('express');
var app = express();
var mysql = require("mysql");
var config = require("./Config");
var DB = mysql.createConnection(config.db);

app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

DB.connect();

app.get('/', function(req, res){
   DB.query('SELECT * FROM Degrees', function(err, degrees) {
      res.render('index', {
         degrees : degrees
      });
   });
});

app.listen(3000); 
console.log('Express app started on port 3000');