-- Done
CREATE TABLE Terms (
   id INT PRIMARY KEY,
   name VARCHAR(64) UNIQUE,
   year YEAR,
   quarter VARCHAR(8),
   UNIQUE(year,quarter)
);

-- Done
CREATE TABLE Departments (
   id INT PRIMARY KEY,
   code VARCHAR(8) UNIQUE,
   name VARCHAR(64)
);

-- Done
CREATE TABLE Degrees (
   id INT PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(128),
   link VARCHAR(1024),
   type VARCHAR(32)
);

-- Done
CREATE TABLE Teachers (
   id INT PRIMARY KEY AUTO_INCREMENT,
   firstName VARCHAR(64),
   lastName VARCHAR(64),
   departmentCode VARCHAR(8),
   rating DECIMAL(4,3),
   link VARCHAR(128)
);

-- Done
CREATE TABLE Courses (
   id INT PRIMARY KEY,
   name VARCHAR(64),
   department VARCHAR(8),
   number INT,
   term INT,
   CONSTRAINT fk_department FOREIGN KEY (department)
   REFERENCES Departments(code),
   CONSTRAINT fk_term FOREIGN KEY (term)
   REFERENCES Terms(id)
);

-- Done
CREATE TABLE DegreeRequirements (
   degree INT,
   departmentCode VARCHAR(8),
   courseNumber INT,
   CONSTRAINT fk_degree FOREIGN KEY (degree)
   REFERENCES Degrees(id)
);

-- Done
CREATE TABLE Classes (
   id VARCHAR(8) PRIMARY KEY,
   course INT,
   section INT,
   tempTeacher VARCHAR(128),
   type VARCHAR(8),
   avail INT,
   taken INT,
   waiting INT,
   status VARCHAR(16),
   days VARCHAR(8),
   tempStartTime VARCHAR(16),
   tempEndTime VARCHAR(16),
   building VARCHAR(128),
   room VARCHAR(8),
   CONSTRAINT fk_course FOREIGN KEY (course)
   REFERENCES Courses(id)
);

-- Done
CREATE TABLE ClassRequirements (
   class VARCHAR(8),
   reqClass VARCHAR(8),
   PRIMARY KEY(class, reqClass),
   CONSTRAINT fk_class FOREIGN KEY (class)
   REFERENCES Classes(id),
   CONSTRAINT fk_reqClass FOREIGN KEY (reqClass)
   REFERENCES Classes(id)
);

