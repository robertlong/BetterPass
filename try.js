var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("./Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

DB.connect();

//DB.query('ALTER TABLE Classes ADD tId INT');
DB.query('SELECT * FROM Classes', function(err, classes) {
	if (err) throw err;

    //console.log(classes);
    for (var i = 0; i < classes.length; i++) {
    	var name = classes[i].tempTeacher.split(/[\s,]+/);
    	var classId = classes[i].id;
    	
    	var last = name[0].trim();
    	console.log(last + " ");
    	if (last === 'STAFF') {
    		var first = name[1];
            DB.query('UPDATE Classes SET tId = -1 WHERE id = ?', classId);
    	}
    	else {
            DB.query('SELECT * FROM Teachers WHERE lastName = ?', last, function(err, rows) {
                var cId = rows[0];
                DB.query('UPDATE Classes SET tId = ? WHERE id = ?', [cId, classId])
            });
    	}
    };
});
