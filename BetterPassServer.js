var express = require('express');
var app = express();
var mysql = require("mysql");
var config = require("./Config");
var _ = require("underscore");
var DB = mysql.createConnection(config.db);

var classFields = "cl.id,course AS courseID, c.name, c.department, c.number AS courseNum,section,"
            +"t.firstName AS teacherFirstName t.lastName AS teacherLastName, t.rating AS teacherRating," 
            +"t.link AS polyRatingURL,type,avail,taken,waiting,status,days,startTime,endTime,building,room";

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

app.get('/api/classes', function(req, res){
   DB.query('SELECT * FROM Classes', function(err, classes) {
      res.send(classes);
   });
});

app.get('/api/classes/:id', function(req, res){
   DB.query('SELECT * FROM Classes WHERE id = ?', req.params.id, function(err, classes) {
      res.send(classes[0]);
   });
});

app.get('/api/classes/:id/requirements', function(req, res){
   DB.query('SELECT * FROM Classes WHERE id IN (SELECT reqClass FROM ClassRequirements WHERE class = ?)', 
      req.params.id, function(err, classReqs) {

      res.send(classReqs);
   });
});

app.get('/api/degrees', function(req, res){
   DB.query('SELECT * FROM Degrees', function(err, degrees) {
      res.send(degrees);
   });
});

app.get('/api/degrees/:id', function(req, res){
   DB.query('SELECT * FROM Degrees WHERE id = ?', req.params.id, function(err, degrees) {
      res.send(degrees[0]);
   });
});

app.get('/api/degrees/:id/requirements', function(req, res){
   DB.query('SELECT * FROM DegreeRequirements a, Courses b WHERE a.degree = ?'
      + 'AND a.departmentCode = b.department AND a.courseNumber = b.number', 
      req.params.id, function(err, degreeReqs) {

      res.send(degreeReqs);
   });
});

app.get('/api/courses', function(req, res){
   DB.query('SELECT * FROM Courses', function(err, courses) {
      res.send(courses);
   });
});

app.get('/api/courses/:id', function(req, res){
   DB.query('SELECT * FROM Courses WHERE id', function(err, courses) {
      res.send(courses[0]);
   });
});

app.get('/api/teachers', function(req, res){
   DB.query('SELECT * FROM Teachers', function(err, teachers) {
      res.send(teachers);
   });
});

app.get('/api/teachers/:id', function(req, res){
   DB.query('SELECT * FROM Teachers WHERE id = ?', req.params.id, function(err, teachers) {
      res.send(teachers[0]);
   });
});

app.get('/api/terms', function(req, res){
   DB.query('SELECT * FROM Terms', function(err, terms) {
      res.send(terms);
   });
});

app.get('/api/terms/:id', function(req, res){
   DB.query('SELECT * FROM Terms WHERE id = ?', req.params.id, function(err, terms) {
      res.send(terms[0]);
   });
});

app.get('/api/departments', function(req, res){
   DB.query('SELECT * FROM Departments', function(err, departments) {
      res.send(departments);
   });
});

app.get('/api/departments/:id', function(req, res){
   DB.query('SELECT * FROM Departments WHERE id = ?', req.params.id, function(err, departments) {
      res.send(departments[0]);
   });
});

app.listen(3000); 
console.log('Express app started on port 3000');