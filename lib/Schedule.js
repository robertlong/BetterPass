var timejs = require("./Time");

var Time = timejs.Time;
var Period = timejs.Period;

var ClassTime = function(id, startTime, endTime){
   this.id = id;
   this.startTime = startTime;
   this.endTime = endTime;
}

var generateSchedules = function(classes) {

 return [[1,2,3],[2,3,4]];
};

exports.generateSchedules = generateSchedules;
exports.ClassTime = ClassTime;