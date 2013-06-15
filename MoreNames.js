var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("./Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

DB.connect();

DB.query('SELECT a.id , department, tFirstName, tLastName FROM Classes a, Courses b WHERE a.course = b.id', function(err, classes) {
	if (err) throw err;

    for (var i = 0; i < classes.length; i++) {
        var classId = classes[i].id;
        
        if (classes[i].tFirstName !== "STAFF") {
            var dep = classes[i].department;
            DB.query("UPDATE classes SET tId = (SELECT DISTINCT id FROM Teachers WHERE lastName = " + mysql.escape(classes[i].tLastName) + " AND departmentCode = " + mysql.escape(dep) + " LIMIT 1) WHERE id = " + mysql.escape(classId));
        }
        else {
            DB.query("UPDATE classes SET tId = -1 WHERE id = " + mysql.escape(classId));
        };
    };      	
});

DB.query("SELECT * FROM(SELECT a.id , tFirstName, tLastName, department, tId FROM Classes a, Courses b WHERE a.course = b.id AND tFirstName != 'STAFF' ORDER BY tID LIMIT 1428) A GROUP BY tLastName, tFirstName", function(err, classes) {
    if (err) throw err;

    for (var i = 0; i < classes.length; i++) {
        DB.query("INSERT INTO Teachers VALUES (NULL," + mysql.escape(classes[i].tFirstName) + "," + mysql.escape(classes[i].tLastName) + "," + mysql.escape(classes[i].department) + ",0,NULL)");
    };          
});

DB.query('SELECT a.id , department, tFirstName, tLastName FROM Classes a, Courses b WHERE a.course = b.id', function(err, classes) {
    if (err) throw err;

    for (var i = 0; i < classes.length; i++) {
        var classId = classes[i].id;
        
        if (classes[i].tFirstName !== "STAFF") {
            var dep = classes[i].department;
            DB.query("UPDATE classes SET tId = (SELECT DISTINCT id FROM Teachers WHERE lastName = " + mysql.escape(classes[i].tLastName) + " AND departmentCode = " + mysql.escape(dep) + " LIMIT 1) WHERE id = " + mysql.escape(classId));
        }
        else {
            DB.query("UPDATE classes SET tId = -1 WHERE id = " + mysql.escape(classId));
        };
    };          
});
