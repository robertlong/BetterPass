var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("./Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

DB.connect();

//DB.query('ALTER TABLE Classes ADD tId INT');
//DB.query('INSERT INTO Teachers VALUES (NULL, "STAFF", NULL, NULL, NULL, NULL)');
DB.query('SELECT * FROM Classes', function(err, classes) {
	if (err) throw err;

    //console.log(classes);
    for (var i = 0; i < classes.length; i++) {
    	var name = classes[i].tempTeacher;
    	var classId = classes[i].id;
    	name = name.split(/[\s,]+/);
    	var last = name[0].trim();
    	console.log(last + " ");
    	if (last === 'STAFF') {
    		DB.query('SELECT * FROM Teachers WHERE firstName = ?', last, function(err, rows) {
    			var cId = rows[0];
    			DB.query('UPDATE Classes SET tId = ? WHERE id = ?', [cId, classId])
    		});
    	}
    	else {
    		var first = name[1];
    		console.log('first' + first);
    		DB.query('SELECT * FROM Teachers WHERE firstName = ? AND lastName = ?', [first, last], function(err, rows) {
    			
    			if (rows.length > 0) {
    				var cId = rows[0];
    				DB.query('UPDATE Classes SET tId = ? WHERE id = ?', [cId, classId]);
    			}
    		});
    	}
    };
});