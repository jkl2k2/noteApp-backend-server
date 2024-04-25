const request = require('supertest');
const { app } = require('../src/app');
const { initTestDB } = require('./app.init');

beforeAll(() => {
    return initTestDB();
});

// CREATE /notes

describe("POST /notes (successfully)", () => {
    it("successfully creates a new note", async () => {
        const notePool = [
            {
                "userid": 1,
                "title": "Normal Note",
                "content": "Here's some very cool content!",
                "url": "https://www.example.com/"
            },
            {
                "userid": 1,
                "title": "E",
                "content": "E",
                "url": "https://www.example.com/"
            },
            {
                "userid": 2,
                "title": "?",
                "content": "Weird title",
                "url": "https://www.example.com/"
            },
        ];

        const { statusCode } = await request(app)
            .post('/notes')
            .send(notePool[Math.floor(Math.random() * notePool.length)]);
        expect(statusCode).toBe(201);
    });
});

describe("POST /notes (bad request)", () => {
    it("FAILS to create a new note", async () => {
        const notePool = [
            {
                "userid": 1,
                "title": "",
                "content": "No title",
                "url": "https://www.example.com/"
            },
            {
                "userid": 1,
                "title": "No content",
                "content": "",
                "url": "https://www.example.com/"
            },
            {
                "userid": 2,
                "title": "No URL",
                "content": "Where's the URL?",
                "url": ""
            },
        ];

        const { statusCode } = await request(app)
            .post('/notes')
            .send(notePool[Math.floor(Math.random() * notePool.length)]);
        expect(statusCode).toBe(400);
    });
});

// READ /notes

describe("GET /notes", () => {
    it("returns all of the database's notes", async () => {
        const { statusCode } = await request(app).get('/notes');
        expect(statusCode).toBe(200);
    });
});

describe("GET /notes/:id", () => {
    it("returns a specific note by ID", async () => {
        const rand = Math.floor(Math.random() * 2) + 1;
        const { statusCode } = await request(app).get(`/notes/${rand}`);
        expect(statusCode).toBe(200);
    });
});