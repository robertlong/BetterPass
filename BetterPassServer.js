var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('index', {
   
  });
});

app.listen(3000); 
console.log('Express app started on port 3000');