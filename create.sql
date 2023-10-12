CREATE TABLE tryhack.student (
  student_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NULL,
  password VARCHAR(45) NULL,
  email VARCHAR(45) NULL,
  class_id VARCHAR(45) NULL,
  PRIMARY KEY (student_id));

CREATE TABLE tryhack.teacher (
  teacher_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NULL,
  password VARCHAR(45) NULL,
  email VARCHAR(45) NULL,
  class_id VARCHAR(45) NULL,
  PRIMARY KEY (teacher_id));

CREATE TABLE tryhack.student_emotion (
  student_id INT NOT NULL AUTO_INCREMENT,
  Date DATETIME,
  Emotion VARCHAR(50s)
  PRIMARY KEY (student_id, Emotion));

INSERT INTO tryhack.student (student_id,name,password,email, class_id) VALUES (1,'Ben','123','ben@example.com', 101);
INSERT INTO tryhack.student (student_id,name,password,email, class_id) VALUES (2,'Tom','123','tom@example.com', 101);
INSERT INTO tryhack.student (student_id,name,password,email, class_id) VALUES (3,'Sam','123','sam@example.com', 101);

INSERT INTO tryhack.teacher (teacher_id,name,password,email, class_id) VALUES (1,'Ms Lim','123','lim@example.com', 101);

INSERT INTO tryhack.student_emotion (student_id,Emotion,Date) VALUES (2,'Anxious','2023-10-10');

