var assert = require("assert"),
    time = require("../lib/Time"),
    schedule = require("../lib/Schedule");

var Time = time.Time, Period = time.Period;
var ClassTime = schedule.ClassTime;

var classTimes = [
   new ClassTime(1, new Time("1:10 PM"), new Time("2:00 PM"), "MATH142"),
   new ClassTime(2, new Time("2:10 PM"), new Time("3:00 PM"), "CPE103"),
   new ClassTime(3, new Time("2:10 PM"), new Time("3:00 PM"), "PSY202"),
   new ClassTime(4, new Time("9:10 AM"), new Time("10:00 AM")), "MATH142",
   new ClassTime(5, new Time("10:10 AM"), new Time("11:00 AM"), "ECON211")
];

describe('Schedule', function(){
  describe('generateSchedules', function(){
    it('should generate 2 schedules', function(){
      assert.equal(schedule.generateSchedules(classTimes).length, 4);
    });
  });
});