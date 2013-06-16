API DOCUMENTATION
=================

The database consists of the following tables:

 - Terms           - List of terms classes can be in.
 - Departments        - Every Department abbreviation and full  
                             name.
 - Degrees            - List of every type and concentration
                             of degree.
 - Teachers           - List of all teachers present on poly  
                             ratings.
 - Courses         - All the courses available at Cal Poly
 - Degree Requirements   - Major Classes required to complete
                             each major
 - Classes               - All classes taught at Cal Poly,
                             teacher course combinations
 - Class Requirements       - Classes that are required for to take
                             the lecture portion of the class.
                             These tuples represent labs and
                             activities. 
 - Clubs           - A list of clubs added by users.


******************************************************************
Terms

   INDEX /api/terms
   SHOW  /api/terms/:id

   id, Name, Year, Quarter 

       id : unique identifier of a term
     Name : the full name of the term
     Year : what year the term is in
  Quarter : the quarter the term is in (eg. Spring)
          
******************************************************************
Departments

   INDEX /api/departments
   SHOW  /api/departments/:id

   id, Code, Name

       id : unique identifier of a department
     Code : 3-4 character abbreviation of department
     Name : Full name of the department

******************************************************************
Degrees

   INDEX /api/degrees
   SHOW  /api/degrees/:id

   id, Name, Link, Type 

       id : unique identifier of a degree
     Name : full name of a degree
     Link : link to the degree’s page on the Cal Poly website
     Type : type of degree (eg. Bachelor’s, Master’s, etc)

******************************************************************
Teachers

   INDEX /api/teachers
   SHOW  /api/teachers/:id
   SHOW  Teacher's Classes /api/teachers/:id/classes

   id, firstName, lastName, departmentCode, rating, link 

       id : unique identifier of a teacher
firstName : teacher’s first name
 lastName : teacher’s last name
departmentCode : foreign key into the department table
   rating : their rating on polyratings.com
     link : link to their page on polyratings.com

******************************************************************
Courses

   INDEX /api/courses
   SHOW  /api/courses/:id

   id, Name, department, number, term 

        id : unique identifier of a teacher
      Name : official name of the course
department : foreign key to department course is associated with
    number : the course number for that department (eg. CPE103)
      term : the term this course takes place in   

******************************************************************
Degree Requirements

   SHOW /api/degrees/:id/requirements

   degree, departmentCode, courseNumber 

        degree : this degree requires the following class
departmentCode : department of required class
  courseNumber : number of the class
          



******************************************************************
Classes

   INDEX /api/classes
   SHOW  /api/classes/:id
   SHOW Classes by department /api/classes/department/:id


   id, Course, Section, type, avail, taken, waiting, status, days, startTime, endTime, building, room, tLastName, tFirstName, tId  

       id : unique identifier of a class
   Course : foreign key into courses
  Section : particular section of a course
     type : the type of class (eg. LAB, LEC, etc)
    avail : spots still available in the class
    taken : spots taken in class
  waiting : how many students are on the waitlist
   status : class either open or closed
     days : the days the class takes place on
startTime : Time to start class
  endTime : Time class ends at
 building : the building the class is taught in
     room : the room in the building the class is taught in
tLastname : last name of the teacher
tFirstname: first name of the teacher
      tId : foreign key into the teachers table

******************************************************************
Class Requirements

   SHOW /api/classes/:id/requirements

   class, reqClass 

    class : foreign key into classes table
 reqClass : must also take this class to take either

******************************************************************
Clubs

   INDEX  /api/clubs
   SHOW   /api/clubs/:id
   CREATE /api/clubs/new?adminToken=<adminToken>&name=<name>&website=<website>
   EDIT   /api/clubs/:id/edit?adminToken=<adminToken>[&name=<name>&website=<website>]

   id, name, website, adminToken 

        id : unique id of a club
      name : full name of the club
   website : user input club regulated site
adminToken : person who create club gets this token, then they can
             use it to edit the existing club

******************************************************************

Error Codes

404 - Item not found
500 - Unknown error
501 - Invalid parameter
502 - Invalid token
