var request = require("request"),
   jsdom = require("jsdom"),
   mysql = require("mysql"),
   config = require("../Config");
var DB = mysql.createConnection(config.db);

function Teacher(firstName, lastName, departmentCode, rating, link) {
   this.firstName = firstName;
   this.lastName = lastName;
   this.departmentCode = departmentCode;
   this.rating = rating;
   this.link = link;
}

function getTerms(callback){
   request({
     uri: "http://polyratings.com/list.phtml"
   }, function(error, response, body) {
      jsdom.env(body,["http://code.jquery.com/jquery.js"],
         function(errors, window) {
            window.$("center table tr").not(':first-child').each(
               function() {
                  var link = window.$(this).find("a").attr("href");
                  var name = window.$(this).find("a").text();
                  var departmentCode = window.$(this).find("td:eq(1)").html().replace("&nbsp;","");
                  var rating = parseFloat(window.$(this).find("td:eq(3)").html().replace("&nbsp;",""));
                  var lastName = name.split(", ")[0];
                  var firstName = name.split(", ")[1];
                  
                  DB.query("INSERT INTO Teachers SET ?", new Teacher(firstName, lastName, departmentCode, rating, link));
               }
            );
            callback();
         }
      );
   });   
}

DB.connect();

getTerms(function(){
   DB.end();
});