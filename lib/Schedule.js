var timejs = require("./Time");

var Time = timejs.Time;
var Period = timejs.Period;

var ClassTime = function(id, startTime, endTime, courseId){
   this.id = id;
   this.courseId = courseId;
   this.startTime = startTime;
   this.endTime = endTime;
}

var generateSchedules = function(classes) {
   for (var i = 0; i < 4; i++) {
      
   };
   return [[1,2,3],[2,3,4]];
};

exports.generateSchedules = generateSchedules;
exports.ClassTime = ClassTime;