var express = require('express');
var app = express();
var mysql = require("mysql");
var config = require("./Config");
var _ = require("underscore");
var crypto = require('crypto');
var DB = mysql.createConnection(config.db);

app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(app.router);

app.use(function(req, res, next){
  res.send(500, 'Page not found!');
});

app.use(function(err, req, res, next){
  res.send(500, 'Something broke!');
});

DB.connect();

app.get('/', function(req, res){
   DB.query('SELECT * FROM Degrees', function(err, degrees) {
      res.render('index', {
         degrees : degrees
      });
   });
});

app.get('/api/classes', function(req, res){
   DB.query('SELECT * FROM Classes a, Courses b, Teachers t WHERE a.course = b.id AND t.id = a.tId', function(err, classes) {
      if(err) {
         return next(err);
      }
      res.send(classes);
   });
});

app.get('/api/classes/:id', function(req, res, next){
   DB.query('SELECT * FROM Classes Classes a, Courses b WHERE a.course = b.id AND id = ?', req.params.id, function(err, classes) {
      if(err) {
         return next(err);
      }
      res.send(classes[0]);
   });
});

app.get('/api/classes/department/:id', function(req, res, next){
   
   DB.query('SELECT * FROM Classes a, Courses b WHERE a.course = b.id AND b.department = ?', req.params.id, function(err, classes) {
      if(err) {
         console.log(err);
         return next(err);
      }
      res.send(classes);
   });
});

app.get('/api/classes/:id/requirements', function(req, res, next){
   DB.query('SELECT * FROM Classes WHERE id IN (SELECT reqClass FROM ClassRequirements WHERE class = ?)', 
      req.params.id, function(err, classReqs) {
      if(err) {
         return next(err);
      }

      res.send(classReqs);
   });
});

app.get('/api/degrees', function(req, res, next){
   DB.query('SELECT * FROM Degrees', function(err, degrees) {
      res.send(degrees);
   });
});

app.get('/api/degrees/:id', function(req, res, next){
   DB.query('SELECT * FROM Degrees WHERE id = ?', req.params.id, function(err, degrees) {
      if(err) {
         return next(err);
      }
      res.send(degrees[0]);
   });
});

app.get('/api/degrees/:id/requirements', function(req, res, next){
   DB.query('SELECT * FROM DegreeRequirements a, Courses b WHERE a.degree = ?'
      + 'AND a.departmentCode = b.department AND a.courseNumber = b.number', 
      req.params.id, function(err, degreeReqs) {
      if(err) {
         return next(err);
      }

      res.send(degreeReqs);
   });
});

app.get('/api/courses', function(req, res){
   DB.query('SELECT c.id, c.name as name, d.name as department, number, year, quarter FROM Courses c, Terms t, Departments d WHERE c.term = t.id AND c.department = d.code', function(err, courses) {
      if(err) {
         return next(err);
      }
      res.send(courses);
   });
});

app.get('/api/courses/:id', function(req, res, next){
   DB.query('SELECT * FROM Courses WHERE id', function(err, courses) {
      if(err) {
         return next(err);
      }
      res.send(courses[0]);
   });
});

app.get('/api/teachers', function(req, res, next){
   DB.query('SELECT * FROM Teachers', function(err, teachers) {
      if(err) {
         return next(err);
      }
      res.send(teachers);
   });
});

app.get('/api/teachers/:id', function(req, res, next){
   DB.query('SELECT * FROM Teachers WHERE id = ?', req.params.id, function(err, teachers) {
      if(err) {
         return next(err);
      }
      res.send(teachers[0]);
   });
});

app.get('/api/teachers/:id/classes', function(req, res){
   DB.query('SELECT * FROM Classes WHERE id IN (SELECT id FROM Classes WHERE tId = ?)', req.params.id, function(err, teachers) {
      res.send(teachers);
   });
});

app.get('/api/terms', function(req, res, next){
   DB.query('SELECT * FROM Terms', function(err, terms) {
      if(err) {
         return next(err);
      }
      res.send(terms);
   });
});

app.get('/api/terms/:id', function(req, res, next){
   DB.query('SELECT * FROM Terms WHERE id = ?', req.params.id, function(err, terms) {
      if(err) {
         return next(err);
      }
      res.send(terms[0]);
   });
});

app.get('/api/departments', function(req, res, next){
   DB.query('SELECT * FROM Departments', function(err, departments) {
      if(err) {
         return next(err);
      }
      res.send(departments);
   });
});

app.get('/api/departments/:id', function(req, res, next){
   DB.query('SELECT * FROM Departments WHERE id = ?', req.params.id, function(err, departments) {
      if(err) {
         return next(err);
      }

      res.send(departments[0]);
   });
});

app.get('/api/departments/:id', function(req, res, next){
   DB.query('SELECT * FROM Departments WHERE id = ?', req.params.id, function(err, departments) {
      if(err) {
         return next(err);
      }
      res.send(departments[0]);
   });
});

app.get('/api/clubs', function(req, res, next){
   DB.query('SELECT id, name, website FROM Clubs', function(err, clubs) {
      if(err) {
         return next(err);
      }
      res.send(clubs);
   });
});

app.get('/api/clubs/new', function(req, res, next){
   var setParams = [];
   var setStatement = "";
   
   if(req.query.name){
      setStatement += " name = ?,";
      setParams.push(req.query.name);
   }
   if(req.query.website){
      setStatement += " website = ?,";
      setParams.push(req.query.website);  
   }
   if(req.query.adminToken){
      setStatement += " adminToken = ?";
      setParams.push(crypto.createHash('md5').update(req.query.adminToken).digest("hex"));  
   }

   if(setParams.length == 3) {
      DB.query('INSERT INTO Clubs SET' + setStatement, setParams, function(err, club) {
         if(err) {
            console.log(err);
            return next(err);
         }
         res.send(club);
      });  
   } else{
      res.send("Invalid parameters");
   }
   
});

app.get('/api/clubs/:id', function(req, res, next){
   DB.query('SELECT id, name, website FROM Clubs WHERE id = ?', req.params.id, function(err, clubs) {
      if(err) {
         return next(err);
      }
      res.send(clubs[0]);
   });
});

app.get('/api/clubs/:id/edit', function(req, res, next){
   var setParams = [];
   var setStatement = "";
   
   if(req.query.name){
      setStatement += " name = ?,";
      setParams.push(req.query.name);
   }
   if(req.query.website){
      setStatement += " website = ?";
      setParams.push(req.query.website);  
   }

   DB.query('SELECT * FROM Clubs WHERE id = ?', req.params.id, function(err, clubs) {
      if(err) {
         console.log(err);
         return next(err);
      }
      var hashedPass = crypto.createHash('md5').update(req.query.adminToken).digest("hex");
      var storedHash = clubs[0].adminToken;
      
      if(hashedPass == storedHash) {
         if(setParams.length > 0) {
            setParams.push(req.params.id);
            DB.query('UPDATE Clubs SET' + setStatement + "WHERE id = ?", setParams, function(err, club) {
               if(err) {
                  console.log(err);
                  return next(err);
               }
               res.send(club);
            });   
         } else{
            res.send("Invalid parameters");
         }
      } else{
         res.send("Invalid token");
      }
   });
   
});

app.listen(3000); 
console.log('Express app started on port 3000');