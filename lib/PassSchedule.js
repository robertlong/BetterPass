function buildSession(termId, callback) {
   request(
      {
         uri: "http://pass.calpoly.edu/init.do?selectedTerm=" + term
      }, 
      function(error, response, body) {
         cookie = response.request.headers.cookie;
         callback();
      }
   );  
}