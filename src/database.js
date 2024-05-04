const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

let pool;

module.exports = function () {
    this.useTestDB = function useTestDB(useTest) {
        let database;

        if (useTest) {
            database = process.env.MYSQL_TEST_DATABASE;
        } else {
            database = process.env.MYSQL_DATABASE;
        }

        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: database
        }).promise();
    };

    this.getAllNotes = async function getAllNotes() {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(`
    SELECT *
    FROM notes`);
        connection.release();
        return rows;
    };

    this.getAllUserNotes = async function getAllUserNotes(id, is_deleted) {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(`
    SELECT *
    FROM notes
    WHERE userid = ? and is_deleted = ?`, [id, is_deleted]);
        connection.release();
        return rows;
    };

    this.getAllNotesByUserId = async function getAllNotesByUserId(id) {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(`
    SELECT *
    FROM notes
    WHERE userid = ?`, [id]);
        connection.release();
        return rows;
    };

    this.getNoteById = async function getNoteById(noteID) {
        const [row] = await pool.query(`
    SELECT *
    FROM notes 
    WHERE noteid = ?`, [noteID]);

        return row;
    };

    this.getUserNoteById = async function getUserNoteById(userID, noteID) {
        const [row] = await pool.query(`
    SELECT *
    FROM notes 
    WHERE noteid = ?
    AND userid = ?`, [noteID, userID]);

        return row;
    };

    this.createNote = async function createNote(userid, title, content, url, is_deleted, date_deleted) {
        const connection = await pool.getConnection();
        const [newNote] = await connection.query(`
        INSERT INTO notes (userid, title, content, url, is_deleted, date_deleted)
        VALUES (?, ?, ?, ?, ?, ?)`, [userid, title, content, url, is_deleted, date_deleted]);
        connection.release();

        const id = newNote.insertId;
        return getNoteById(id);
    };

    this.softdeleteNote = async function softdeleteNote(is_deleted, date_deleted, id) {
        const [note] = await pool.query(`
        UPDATE notes SET is_deleted = ?, date_deleted = ? WHERE noteid = ?`, [is_deleted, date_deleted, id]);
    };

    this.deleteNotes = async function deleteNotes(){
        const connection = await pool.getConnection();
        connection.query(`
        DELETE FROM notes WHERE date_deleted < CURRENT_DATE - 30 AND is_deleted = 1`);
        connection.release();
    }

    this.getAllTags = async function getAllTags() {
        const [rows] = await pool.query(`SELECT * FROM tags`);
        return rows;
    };

    this.getAllUserTags = async function getAllUserTags(userid) {
        const [rows] = await pool.query(`
        SELECT *
        FROM tags
        WHERE userid = ?`, [userid]);
        return rows;
    };

    this.getUserTagByName = async function getUserTagByName(userid, tag) {
        const [row] = await pool.query(`
        SELECT * FROM tags
        WHERE userid = ?
        AND tag = ?`, [userid, tag]);

        return row;
    };

    this.getTagByName = async function getTagByName(tag) {
        const [row] = await pool.query(`
        SELECT *
        FROM tags 
        WHERE tag = ?`, [tag]);

        return row;
    };

    this.getTagById = async function getTagById(id) {
        const [row] = await pool.query(`
        SELECT *
        FROM tags 
        WHERE tagid = ?`, [id]);

        return row;
    };

    this.createTag = async function createTag(userid, tag) {
        const [newTag] = await pool.query(`
        INSERT INTO tags (userid, tag)
        VALUES (?, ?)`, [userid, tag]);

        const id = newTag.insertId;
        return getTagById(id);
    };

    this.getAllLabels = async function getAllLabels() {
        const [rows] = await pool.query(`SELECT * FROM label`);
        return rows;
    };

    this.createLabel = async function createLabel(NoteId, TagId) {
        const [noteTag] = await pool.query(`
        INSERT INTO label (noteid, tagid)
        VALUES (?, ?)`, [NoteId, TagId]);

        return getNoteWithTagById(NoteId);
    };

    this.getAllNotesWithTags = async function getAllNotesWithTags() {
        const [rows] = await pool.query(`
        SELECT title, content, url, tag 
        FROM notes 
        JOIN label ON notes.noteid = label.noteid
        JOIN tags ON label.tagid = tags.tagid`);
        return rows;
    };

    this.getNotesByAssignedTagId = async function getNotesByAssignedTagId(id) {
        const [rows] = await pool.query(`
        SELECT title, content, url, tag 
        FROM notes 
        JOIN label ON notes.noteid = label.noteid
        JOIN tags ON label.tagid = tags.tagid 
        WHERE label.tagid = ?`, [id]);

        return rows;
    };

    this.getNoteWithTagById = async function getNoteWithTagById(id) {
        const [row] = await pool.query(`
        SELECT title, content, url, tag 
        FROM notes 
        JOIN label ON notes.noteid = label.noteid
        JOIN tags ON label.tagid = tags.tagid 
        WHERE notes.NoteId = ?`, [id]);
        return row[0];
    };

    this.getTagsOnNote = async function getTagsOnNote(noteid) {
        const [rows] = await pool.query(`
        SELECT tag
        FROM notes
        JOIN label ON notes.noteid = label.noteid
        JOIN tags ON label.tagid = tags.tagid 
        WHERE notes.noteid = ?`, [noteid]);

        return rows;
    };

    this.updateTag = async function updateTag(tag, id) {
        const [row] = await pool.query(`UPDATE label SET tagid = ? WHERE noteid = ?`, [tag, id]);

        return getNoteWithTagById(id);

    };

    this.updateTagName = async function updateTagName(id, newName) {
        const [row] = await pool.query(`UPDATE tags SET tag = ? WHERE tagid = ?`, [newName, id]);

        return getTagById(id);
    };

    this.deleteTagById = async function deleteTagById(id) {
        const [row] = await pool.query(`DELETE FROM tags WHERE tagid = ?`, [id]);

        return row;
    };

    this.getUsersById = async function getUsersById(id) {
        const [row] = await pool.query(`SELECT * FROM users WHERE userid = ?`, [id]);
        return row;
    };

    this.getUsersByUsername = async function getUsersByUsername(username) {
        const [row] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);

        return row;
    };

    this.newUser = async function newUser(firstname, lastname, username, email, password) {
        const [user] = await pool.query('INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)',
            [firstname, lastname, username, email, password]);

        const id = user.insertId;
        return getUsersById(id);
    };

    this.deleteUser = async function deleteUser(id) {
        const [row] = await pool.query('DELETE FROM users WHERE userid = ?', [id]);
        return row;
    };
};