var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("../Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

var cookie = null;
/*var terms = [];
var departments = [];
var finishedDepartments = [];
var ges = [];
var courses = [];
var classes = [];
var classReqs = [];*/

function Term(name, id) {
   this.name = name;
   this.id = id;
}

function Department(name, code, id) {
   this.name = name;
   this.code = code;
   this.id = id;  
}

function GE(name, id) {
   this.name = name;
   this.id = id;  
}

function Class(courseNum, classNum, section, type, avail, taken, status, waiting, days, startTime, endTime, teacher, building, room) {
   this.course = courseNum;
   this.id = classNum;
   this.section = section;
   this.type = type;
   this.avail = avail;
   this.taken = taken;
   this.waiting = waiting;
   this.status = status;
   this.days = days;
   this.tempStartTime = startTime;
   this.tempEndTime = endTime;
   this.tempTeacher = teacher;
   this.building = building;
   this.room = room;
}

function ClassReq(classID, reqClassID) {
   this.class = classID;
   this.reqClass = reqClassID;
}

function Course(name, id, department, courseNum) {
   this.name = name;
   this.id = id;
   this.department = department;
   this.number = courseNum;
   this.term = parseInt(terms[1].id);
}

function buildSession(callback) {
   request(
      {
         uri: "http://pass.calpoly.edu/init.do?selectedTerm=2138"
      }, 
      function(error, response, body) {
         cookie = response.request.headers.cookie;
         callback();
      }
   );  
}

function getTerms(callback){
   request({
     uri: "http://pass.calpoly.edu"
   }, function(error, response, body) {
      jsdom.env(body,["http://code.jquery.com/jquery.js"],
         function(errors, window) {
            window.$("[name='selectedTerm']").children().each(
               function() {
                  terms.push(new Term(window.$(this).text(),  window.$(this).attr('value')));
               }
            );
            callback();
         }
      );
   });   
}

function getDepartments(term, callback){
   request({
     uri: "http://pass.calpoly.edu/init.do?selectedTerm=" + term
   }, function(error, response, body) {
      jsdom.env(body,["http://code.jquery.com/jquery.js"],
         function(errors, window) {
            window.$("[name='departmentId']").children().each(
               function() {
                  var code = window.$(this).text().split("-")[0];
                  var name = window.$(this).text().split("-")[1]
                  departments.push(new Department(name, code, window.$(this).attr('value')));
                  //DB.query("INSERT INTO Departments SET ?", new Department(name, code, window.$(this).attr('value')));
               }
            );
            callback();
         }
      );
   });   
}

function getGEs(term, callback) {
   request({
     uri: "http://pass.calpoly.edu/init.do?selectedTerm=" + term
   }, function(error, response, body) {
      jsdom.env(body,["http://code.jquery.com/jquery.js"],
         function(errors, window) {
            window.$("[name='generalEdCode']").children().each(
               function() {
                  ges.push(new GE(window.$(this).text(),  window.$(this).attr('value')));
               }
            );
            callback();
         }
      );
   });   
}

function queryCourses(query, callback) {
   request({
     uri: "http://pass.calpoly.edu/search.do?"+ query,
     headers: {cookie: cookie}
   }, function(error, response, body) {
      jsdom.env(body,["http://code.jquery.com/jquery.js"],
         function(errors, window) {
            window.$("#course-table tbody").children().each(
               function() {
                  var id = parseInt(window.$(this).children().eq(0).find("a").attr("onclick").match(/selectCourse\((\d+)\)/)[1]);
                  var department = window.$(this).children().eq(1).text();
                  var courseNum = parseInt(window.$(this).children().eq(2).text());
                  var name = window.$(this).children().eq(3).contents().eq(0).text().replace("\n\t\t        \t", "").trim();
                  courses.push(new Course(name, id, department, courseNum));
                  console.log(new Course(name, id, department, courseNum));
               }
            );
            callback();
         }
      );
   });
}

function getCoursesByDepartment(departmentId, callback) {
   queryCourses("dispatch=searchByDept&=Show%20Only%20USCP%20Classes&generalEdCode=&departmentId=" + departmentId +"&showClosed=true", callback);
}

function selectCourse(course, callback) {
   request({
     uri: "http://pass.calpoly.edu/course.do?dispatch=add&id=" + course.id,
     headers: {cookie: cookie}
   }, function(error, response, body) {
      if(error) throw error;
      
      callback();
   });
}

function deselectCourses(callback) {
   request({
     uri: "http://pass.calpoly.edu/course.do?dispatch=removeAllFull",
     headers: {cookie: cookie}
   }, function(error, response, body) {
      if(error) throw error;
      callback();
   });
}

function processSelectedCourses(callback) {
   request({
     uri: "http://pass.calpoly.edu/workflow.do?dispatch=next&current=0&next=1",
     headers: {cookie: cookie}
   }, function(error, response, body) {
      if(error) throw error;

      jsdom.env(body,["http://code.jquery.com/jquery.js"],
         function(errors, window) {
            var classes = [];
            var reqs = [];

            window.$(".table-courselist-header").each(function(){
               var courseNum = parseInt(window.$(this).find(".line-maps-link").attr("href").match(/courseID=(\d+)/)[1]);
               window.$(this).next().find(":has(.table-cell-normal),:has(.table-cell-alt)").each(function() {
                  var children = window.$(this).children();

                  var section = parseInt(children.eq(1).text());
                  var type = children.eq(2).text();
                  var classNum = children.eq(3).text();
                  var teacher = children.eq(4).text();
                  var avail = parseInt(children.eq(5).text());
                  var taken = parseInt(children.eq(6).text());
                  var status = children.eq(8).text();
                  var waiting = parseInt(children.eq(7).text());
                  var days = children.eq(9).text() == 'TBA' ? '' : children.eq(9).text();
                  var startTime = children.eq(10).text() == 'TBA' ? null : children.eq(10).text();
                  var endTime = children.eq(11).text() == 'TBA' ? null : children.eq(11).text();
                  var building = children.eq(12).text();
                  var room = children.eq(13).text().replace(/[^TBA\d]/g,"");

                  if(status.trim() == '') {
                     var previous = window.$(this).prev();
                     var suffix = 2;
                     while(previous.children().eq(8).text().trim() == '') {
                        previous = previous.prev();
                        suffix++;
                     }
                     var pChildren = previous.children();
                     
                     section = parseInt(pChildren.eq(1).text());
                     type = pChildren.eq(2).text();
                     classNum = pChildren.eq(3).text() + "-" + suffix;
                     teacher = pChildren.eq(4).text();
                     avail = parseInt(pChildren.eq(5).text());
                     taken = parseInt(pChildren.eq(6).text());
                     status = pChildren.eq(8).text();
                     waiting = parseInt(pChildren.eq(7).text());
                     days = children.eq(1).text() == 'TBA' ? '' : children.eq(1).text();
                     startTime = children.eq(2).text() == 'TBA' ? null : children.eq(2).text();
                     endTime = children.eq(3).text() == 'TBA' ? null : children.eq(3).text();
                     building = children.eq(4).text();
                     room = children.eq(5).text().replace(/[^TBA\d]/g,"");
                     //console.log(new Class(courseNum, classNum, section, type, avail, taken, status, waiting, days, 
                     //   startTime, endTime, teacher, building, room));
                  }

                  if(type == 'LEC') {
                     window.$(this).nextUntil(':has(.table-cell-header)',':has(.table-cell-normal),:has(.table-cell-alt)').each(function() {
                        var labChildren = window.$(this).children();
                        var labType = labChildren.eq(2).text();
                        var labNum = labChildren.eq(3).text();
                        if(labType == 'LAB' && labNum != '') {
                           console.log(new ClassReq(classNum, labNum));
                           reqs.push(new ClassReq(classNum, labNum));
                           //DB.query("INSERT INTO ClassRequirements SET ?", new ClassReq(classNum, labNum));
                        }
                     });
                  }
                  console.log(new Class(courseNum, classNum, section, type, avail, taken, status, waiting, days, 
                     startTime, endTime, teacher, building, room));
                  classes.push(new Class(courseNum, classNum, section, type, avail, taken, status, waiting, days, 
                     startTime, endTime, teacher, building, room));
                  
               });
            });
            
            async.each(classes, insertClass, function(){
               async.each(reqs, insertClassReq, function(){
                  callback();
               });
            });
         }
      );
   });
}

function insertClass(Class, callback) {
   DB.query("REPLACE INTO Classes SET ?", Class, function(){
      callback(); 
   });
}

function insertClassReq(req, callback) {
   DB.query("REPLACE INTO ClassRequirements SET ?", req, function(){
      callback();              
   });
}

function scrapeClasses() {
   DB.connect();

   DB.query('SELECT * FROM Departments', function(err, departments) {
      if (err) throw err;

      console.log(departments);

      async.eachSeries(departments, processDepartment, function(err){
         DB.end();
         console.log("Done!");
         
      });
   });
}

function processDepartment(department, callback) {
   console.log(department);
   DB.query('SELECT * FROM Courses WHERE department = ?', [department.code], function(err,courses){
      async.each(courses, selectCourse, function(err){
         processSelectedCourses(function(){
            deselectCourses(function(){
               callback();
            }); 
         });
      });
   });
}

buildSession(function(){
   scrapeClasses();
});


/*DB.connect();

getTerms(function(){
   /*terms[0].year = 2013;
   terms[1].year = 2013;
   terms[0].quarter = "Summer";
   terms[1].quarter = "Fall";
   DB.query("INSERT INTO Terms SET ?", terms[0]);
   DB.query("INSERT INTO Terms SET ?", terms[1]);
   console.log(terms);
   getDepartments(terms[1].id, function(){
      console.log(departments);
      buildSession(terms[1].id, function(){
         for(var i = 0; i < departments.length; i++){
            getCoursesByDepartment(departments[i].id,function(){
               /*finishedDepartments.push(departments[i]);
               if(finishedDepartments.length == departments.length) {
                  //DB.end();
               } 
               for(var j = 0; j < courses.length; j++) {
                  selectCourse(courses[j].id, function(courseId){
                  });
                  console.log(courses[j]);
                  //DB.query("REPLACE INTO Courses SET ?", courses[j]);
               }
               processSelectedCourses(function(){
                  deselectCourses(function(){

                  }); 
               });
            });      
         }
      });
   });
}*/