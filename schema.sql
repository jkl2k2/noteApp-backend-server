DROP DATABASE IF EXISTS note_app;
CREATE DATABASE note_app;
USE note_app;

CREATE TABLE notes (
    noteid integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(2048) NOT NULL
);

CREATE TABLE tags (
    tagid INTEGER PRIMARY KEY AUTO_INCREMENT,
    tag VARCHAR(250) NOT NULL  
);

CREATE TABLE label (
    labelid INTEGER Primary KEY AUTO_INCREMENT,
    noteid INT NOT NULL,
    tagid INT NOT NULL,
    CONSTRAINT ID1 FOREIGN KEY (noteid) REFERENCES  notes(noteid) ON DELETE CASCADE,
    CONSTRAINT ID2 FOREIGN KEY (tagid) REFERENCES  tags(tagid) ON DELETE CASCADE
);

INSERT INTO notes (title, content, url) VALUES
('NEW YORK TIMES', '(Some text from the New York Times)', 'https://www.nytimes.com/'),
('FORBES', '(Some text from a Forbes article)', 'https://www.forbes.com/sites/forbesfinancecouncil/2023/07/03/the-power-of-a-teamwork-culture-maximizing-your-strengths/?sh=43024c6c11e1');

INSERT INTO tags (tag) VALUES
('Research'),
('School');

INSERT INTO label (noteid, tagid) VALUES 
(1, 1),
(2, 2);