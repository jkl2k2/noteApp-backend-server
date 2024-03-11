import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();


export async function getAllNotes() {
    const [rows] = await pool.query(`SELECT * FROM notes`);
    return rows;
}

export async function getNoteById(id) {
    const [row] = await pool.query(`
    SELECT *
    FROM notes 
    WHERE NoteId = ?`, [id]);

    return row[0];
}

export async function createNote(title, content, url) {
    const [newNote] = await pool.query(`
    INSERT INTO notes (title, content, url)
    VALUES (?, ?, ?)`, [title, content, url]);

    const id = newNote.insertId;
    return getNoteById(id);
}

export async function deleteNote(id) {
    const [note] = await pool.query(`
    DELETE FROM notes WHERE NoteId = ?`, [id]);
}

export async function getAllTags() {
    const [rows] = await pool.query(`SELECT * FROM tags`);
    return rows;
}

export async function getTagById(id) {
    const [row] = await pool.query(`
    SELECT *
    FROM tags 
    WHERE TagId = ?`, [id]);

    return row[0];
}

export async function getTagByName(tag) {
    const [row] = await pool.query(`
    SELECT *
    FROM tags 
    WHERE tag = ?`, [tag]);

    return row;
}

export async function createTag(tag) {
    const [newTag] = await pool.query(`
    INSERT INTO tags (tag)
    VALUES (?)`, [tag]);

    const id = newTag.insertId;
    return getTagById(id);
}

