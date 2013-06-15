var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("./Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

DB.connect();

DB.query('SELECT * FROM Classes', function(err, classes) {
	if (err) throw err;

    //console.log(classes);
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].tempStartTime != null && classes[i].tempEndTime != null) {
    	    var start = classes[i].tempStartTime.split(' ')[0];
            var sTod = classes[i].tempStartTime.split(' ')[1];
            var end = classes[i].tempEndTime.split(' ')[0];
            var eTod = classes[i].tempEndTime.split(' ')[1];
    	    var classId = classes[i].id;

            
            var sHour = parseInt(start.split(':')[0]);
            var sMin = parseInt(start.split(':')[1]);
            if (sTod === 'PM' && sHour !== 12) {
                sHour += 12;
            };
            var eHour = parseInt(end.split(':')[0]);
            var eMin = parseInt(end.split(':')[1]);
            if (eTod === 'PM' && eHour !== 12) {
                eHour += 12;
            };
            DB.query("UPDATE Classes SET startTime = TIME_FORMAT("+ mysql.escape(sHour + ':' + sMin) +", "+ mysql.escape('%H:%i') +"), endTime = TIME_FORMAT("+ mysql.escape(eHour + ':' + eMin) +", "+ mysql.escape('%H:%i') +")  WHERE id =" + mysql.escape(classId));
        };
    };      	
});

DB.query("ALTER TABLE Classes DROP tempEndTime");
DB.query("ALTER TABLE Classes DROP tempStartTime");


