var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("../Config"),
   async = require("async");
var DB = mysql.createConnection(config.db);

function Degree(name, link, type) {
   this.name = name;
   this.link = "http://catalog.calpoly.edu" + link;
   this.type = type;
}

function DegreeRequirement(departmentCode, courseNumber) {
   this.departmentCode = departmentCode;
   this.courseNumber = courseNumber;
}

function getDegrees(callback){
   var degrees = [];

   request({
     uri: "http://catalog.calpoly.edu/programsaz/"
   }, function(error, response, body) {
      jsdom.env(body,["http://code.jquery.com/jquery.js"],
         function(errors, window) {
            window.$('a[name="bachelordegrees"]').nextUntil('a[name="concentrations"]','.plist').andSelf().find('a').each(
               function() {
                  var el = window.$(this);
                  var name = el.text();
                  var link = el.attr("href");
                  if(link != undefined) {
                     degrees.push(new Degree(name,link,"bachelors"));
                  }
               }
            );
            window.$('a[name="concentrations"]').nextUntil('a[name="minors"]','.plist').andSelf().find('a').each(
               function() {
                  var el = window.$(this);
                  var name = el.text();
                  var link = el.attr("href");
                  if(link != undefined) {
                     degrees.push(new Degree(name,link,"concentration"));   
                  }
               }
            );
            window.$('a[name="minors"]').nextUntil('#graduatetextcontainer','.plist').andSelf().find('a').each(
               function() {
                  var el = window.$(this);
                  var name = el.text();
                  var link = el.attr("href");
                  if(link != undefined) {
                     degrees.push(new Degree(name,link,"minor"));
                  }
               }
            );
            window.$('h3:has(a[name="mastersdegrees"])').nextUntil('a[name="specializations"]','.plist').andSelf().find('a').each(
               function() {
                  var el = window.$(this);
                  var name = el.text();
                  var link = el.attr("href");
                  if(link != undefined) {
                     degrees.push(new Degree(name,link,"masters"));
                  }
               }
            );
            window.$('h3:has(a[name="specializations"])').nextUntil('a[name="certificates"]','.plist').andSelf().find('a').each(
               function() {
                  var el = window.$(this);
                  var name = el.text();
                  var link = el.attr("href");
                  if(link != undefined) {
                     degrees.push(new Degree(name,link,"specialization"));   
                  }
               }
            );
            window.$('h3:has(a[name="certificates"])').nextUntil('a[name="otherprogramstextcontainer"]','.plist').andSelf().find('a').each(
               function() {
                  var el = window.$(this);
                  var name = el.text();
                  var link = el.attr("href");
                  if(link != undefined) {
                     degrees.push(new Degree(name,link,"certificate"));
                  }
               }
            );
            callback(degrees);
         }
      );
   });   
}

function getRequirements(degree, callback) {
   request({
     uri: degree.link
   }, function(error, response, body) {
      if(error == null) {
         jsdom.env(body,["http://code.jquery.com/jquery.js"],
            function(errors, window) {
               var reqs = [];

               window.$(".codecol a").each(function(){
                  var rawText = window.$(this).attr("onclick");
                  if(rawText) {
                     var courseCode = rawText.match(/showCourse\(this, '([\w\s]+)'\);/)[1];
                     var departmentCode = courseCode.split(" ")[0];
                     var courseNumber = parseInt(courseCode.split(" ")[1]);

                     reqs.push(new DegreeRequirement(departmentCode, courseNumber));     
                  }
               });
               DB.query('SELECT id FROM Degrees WHERE name = ' + mysql.escape(degree.name), function(err, rows) {
                  console.log(reqs);
                  for(var i = 0; i < reqs.length; i++) {
                     reqs[i].degree = rows[0]['id'];
                     DB.query("INSERT INTO DegreeRequirements SET ?", reqs[i]);
                  }
               });
               
               //degreeReqs.push();
               
               callback();
            }
         );
      } else {
         console.log("Error: " + degree);
      }
      
   }); 
}

function insertDegree(degree, callback) {
   DB.query("INSERT INTO Degrees SET ?", degree, function(){
      callback();
   });
}

var scrapeDegrees = function(callback){
   DB.connect();

   getDegrees(function(degrees){
      async.each(degrees, insertDegree, function(){
         callback();
      });
   });
}

var scrapeDegreeRequirements = function(callback){
   DB.connect();

   getDegrees(function(degrees){
      async.each(degrees, getRequirements, function(){
         callback();
      });
   });
}

exports.scrapeDegrees = scrapeDegrees;
exports.scrapeDegreeRequirements = scrapeDegreeRequirements;