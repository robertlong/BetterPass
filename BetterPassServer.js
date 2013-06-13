var express = require('express');
var app = express();
var mysql = require("mysql");
var config = require("./Config");
var _ = require("underscore");
var crypto = require('crypto');
var DB = mysql.createConnection(config.db);

var classFields = "cl.id,course AS courseID, c.name, c.department, c.number AS courseNum,section,"
            +"t.firstName AS teacherFirstName t.lastName AS teacherLastName, t.rating AS teacherRating," 
            +"t.link AS polyRatingURL,type,avail,taken,waiting,status,days,startTime,endTime,building,room";

app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(app.router);

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  res.send(500, 'Page not found!');
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.


app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
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

app.get('/api/classes', function(req, res, next){
   DB.query('SELECT * FROM Classes a, Courses b WHERE a.course = b.id', function(err, classes) {
      if(err) {
         return next(err);
      }
      res.send(classes);
   });
});

app.get('/api/classes/:id', function(req, res, next){
   DB.query('SELECT * FROM Classes Classes a, Courses b WHERE a.course = b.id AND id = ?', req.params.id, function(err, classes) {
      res.send(classes[0]);
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

app.get('/api/courses', function(req, res, next){
   DB.query('SELECT * FROM Courses', function(err, courses) {
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