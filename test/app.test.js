const request = require('supertest');
const app = require('../src/app.cjs');
const mysql = require('mysql2');

let pool;

beforeAll(() => {
    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();

    return pool;
});

describe("POST /notes", () => {
    it("creates a new note", async () => {
        const query = {
            "userid": 1,
            "title": "[ JEST TEST NOTE ]",
            "content": "[ JEST TEST CONTENT ]",
            "url": "https://www.example.com/"
        };

        const { statusCode } = await request(app)
            .post('/notes')
            .send(query);
        expect(statusCode).toBe(201);
    });
});

describe("GET /notes", () => {
    it("returns all of the database's notes", async () => {
        const { statusCode } = await request(app).get('/notes');
        expect(statusCode).toBe(200);
    });


});