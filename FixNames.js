var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("./Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

DB.connect();

DB.query('ALTER TABLE Classes ADD tFirstName VARCHAR(50)');
DB.query('ALTER TABLE Classes ADD tLastName VARCHAR(100)');
DB.query('SELECT a.id , tempTeacher, department, tFirstName, tLastName FROM Classes a, Courses b WHERE a.course = b.id', function(err, classes) {
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
            DB.query("UPDATE Classes SET tFirstName = " + mysql.escape(first) + ", tLastName = " + mysql.escape(last) + " WHERE id = " + mysql.escape(classId));
        }
        else {
            DB.query("UPDATE Classes SET tFirstName = 'STAFF', tLastName = 'STAFF' WHERE id = " + mysql.escape(classId));
        };
    };          
});
DB.query("ALTER TABLE Classes DROP tempTeacher");

