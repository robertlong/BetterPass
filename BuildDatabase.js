var CalPolyMajors = require("./scraper/CalPolyMajors"),
    CalPolyPass = require("./scraper/CalPolyPass"),
    PolyRatings = require("./scraper/PolyRatings");

CalPolyMajors.scrapeDegrees(function(){
   console.log("Finished scraping degrees.");
   CalPolyMajors.scrapeDegreeRequirements(function(){
      console.log("Finished scraping degree requirements.");
      PolyRatings.scrapeTeachers(function(){
         console.log("Finished scraping teachers.");
         CalPolyPass.scrapeTermsDepartmentsCourses(function(){
            console.log("Finished scraping terms, departments, and courses.");
            CalPolyPass.scrapeClasses(function(){
               console.log("Finished scraping classes.");
               console.log("Done!");
            });
         });
      })
   });   
});
