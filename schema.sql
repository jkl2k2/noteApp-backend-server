DROP DATABASE IF EXISTS note_app;
CREATE DATABASE note_app;
USE note_app;

CREATE TABLE users (
    userid INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    username VARCHAR(250) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(500) NOT NULL
);

CREATE TABLE notes (
    noteid INT PRIMARY KEY AUTO_INCREMENT,
    userid INT NOT NULL, 
    title VARCHAR(250) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(2048) NOT NULL,
    CONSTRAINT ID3 FOREIGN KEY (userid) REFERENCES users(userid) on DELETE CASCADE
);

CREATE TABLE tags (
    tagid INT PRIMARY KEY AUTO_INCREMENT,
    tag VARCHAR(250) NOT NULL  
);

CREATE TABLE label (
    labelid INT Primary KEY AUTO_INCREMENT,
    noteid INT NOT NULL,
    tagid INT NOT NULL,
    CONSTRAINT ID1 FOREIGN KEY (noteid) REFERENCES notes(noteid) ON DELETE CASCADE,
    CONSTRAINT ID2 FOREIGN KEY (tagid) REFERENCES tags(tagid) ON DELETE CASCADE
);

INSERT INTO users (firstname, lastname, username, email, password) VALUES 
('testUser', 'testUser', 'testuser1', 'testUser@gmail.com', 'testuser1'),
('adminUser', 'adminUser', 'Admin', 'adminUser@gmail.com', 'Admin');

INSERT INTO notes (userid, title, content, url) VALUES
(1, 'NEW YORK TIMES', '(Some text from the New York Times)', 'https://www.nytimes.com/'),
(2, 'FORBES', '(Some text from a Forbes article)', 'https://www.forbes.com/sites/forbesfinancecouncil/2023/07/03/the-power-of-a-teamwork-culture-maximizing-your-strengths/?sh=43024c6c11e1');

INSERT INTO tags (tag) VALUES
('Research'),
('School');

INSERT INTO label (noteid, tagid) VALUES 
(1, 1),
(2, 2);