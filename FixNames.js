var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("./Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

DB.connect();

//DB.query('ALTER TABLE Classes ADD tId INT');
DB.query('SELECT a.id , tempTeacher, department FROM Classes a, Courses b WHERE a.course = b.id ', function(err, classes) {
	if (err) throw err;

    for (var i = 0; i < classes.length; i++) {
        var fullName = classes[i].tempTeacher.trim();
        var classId = classes[i].id;
        
        if (fullName !== "STAFF") {
            var first = fullName.split(',')[1];
            if (first.indexOf(' ') !==  -1) {
                var first = first.split(' ')[0];
            };
            var last = fullName.split(',')[0];
            var dep = classes[i].department;
            console.log(classId);
            DB.query("UPDATE classes SET tId = (SELECT DISTINCT id FROM Teachers WHERE lastName = " + mysql.escape(last) + " AND departmentCode = " + mysql.escape(dep) + " LIMIT 1) WHERE id = " + mysql.escape(classId));
        }
        else {
            DB.query("UPDATE classes SET tId = -1 WHERE id = " + mysql.escape(classId));
        };
    };      	
});
