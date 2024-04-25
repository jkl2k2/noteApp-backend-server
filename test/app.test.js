const request = require('supertest');
const { app } = require('../src/app');
const { initTestDB } = require('./app.init');

beforeAll(() => {
    return initTestDB();
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