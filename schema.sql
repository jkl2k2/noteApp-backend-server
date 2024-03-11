CREATE DATABASE Note_app;
USE Note_app;

CREATE TABLE notes (
    NoteId integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(2048) NOT NULL
);

CREATE TABLE tags (
    TagId INTEGER PRIMARY KEY AUTO_INCREMENT,
    tag VARCHAR(250) NOT NULL  
);

CREATE TABLE label (
    labelId INTEGER Primary KEY AUTO_INCREMENT,
    NoteId INT NOT NULL,
    TagId INT NOT NULL,
    CONSTRAINT ID1 FOREIGN KEY (NoteId) REFERENCES  notes(NoteId) ON DELETE CASCADE,
    CONSTRAINT ID2 FOREIGN KEY (TagId) REFERENCES  tags(TagId) ON DELETE CASCADE
);

INSERT INTO notes (title, content, url) VALUES
('NEW YORK TIMES', 'text', 'https://www.nytimes.com/'),
('FORBES', 'text', 'https://www.forbes.com/sites/forbesfinancecouncil/2023/07/03/the-power-of-a-teamwork-culture-maximizing-your-strengths/?sh=43024c6c11e1');

INSERT INTO tags (tag) VALUES
('Research'),
('School');

INSERT INTO label (NoteId, TagId) VALUES 
(1, 1),
(2, 2);

SELECT * FROM notes;
SELECT * FROM tags;
SELECT * FROM label;
SELECT title, content, url, tag FROM notes join label on notes.NoteId = label.NoteId
join tags on label.TagId = tags.TagId WHERE tag = 'school';

DELETE FROM tags where TagId = 3;
