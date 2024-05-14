const request = require('supertest');
const { app } = require('../src/app');
const { initTestDB } = require('./app.init');

const rand = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const randInt = (min, max) => {
    return Math.floor(Math.random() * max) + min;
};

const asJSON = (input) => {
    return JSON.parse(input);
};

beforeAll(() => {
    return initTestDB();
});

// ------------
// /notes tests
// ------------
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
            .send(rand(notePool));
        expect(statusCode).toBe(201);
    });
});

describe("POST /notes (bad request)", () => {
    it("fails to create a new note due to missing fields", async () => {
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
            {
                "userid": "",
                "title": "No userid",
                "content": "?",
                "url": "https://www.example.com/"
            },
        ];

        const { statusCode } = await request(app)
            .post('/notes')
            .send(rand(notePool));
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
        const { statusCode } = await request(app).get(`/notes/${randInt(1, 2)}`);
        expect(statusCode).toBe(200);
    });
});

describe("GET /notes querying by user", () => {
    it("returns all of user's notes", async () => {
        const { statusCode } = await request(app).get(`/notes?userid=${randInt(1, 2)}`);
        expect(statusCode).toBe(200);
    });
});

describe("GET /notes querying by user (bad request)", () => {
    it("returns 404 error because user does not exist", async () => {
        const { statusCode, res } = await request(app).get(`/notes?userid=0`);
        expect(statusCode).toBe(404);
        expect(asJSON(res.text)).toHaveProperty("error", "No notes were found");
    });
});

describe("GET /notes/:id/tags", () => {
    it("returns the tags associated with a note", async () => {
        const { statusCode } = await request(app).get(`/notes/1/tags`);
        expect(statusCode).toBe(200);
    });
});

describe("GET /notes/:id/tags (note doesn't exist)", () => {
    it("returns 404 error because note doesn't exist", async () => {
        const { statusCode, res } = await request(app).get(`/notes/0/tags`);
        expect(statusCode).toBe(404);
        expect(asJSON(res.text)).toHaveProperty("error", "Note with id=0 not found.");
    });
});

describe("GET /notes/:id/tags (no tags exist)", () => {
    it("returns 404 error because no tags are associated with the note", async () => {
        const { statusCode, res } = await request(app).get(`/notes/3/tags`);
        expect(statusCode).toBe(404);
        expect(asJSON(res.text)).toHaveProperty("error", "Note with id=3 has no tags.");
    });
});

describe("POST & GET /notes - post and get note", () => {
    it("creates a note, then tries to query it right after", async () => {
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

        const { statusCode: postStatusCode, res } = await request(app)
            .post('/notes')
            .send(rand(notePool));
        expect(postStatusCode).toBe(201);

        const { statusCode: getStatusCode } = await request(app).get(`/notes/${asJSON(res.text)[0].noteid}`);
        expect(getStatusCode).toBe(200);
    });
});

// ------------
// /tags tests
// ------------
describe("POST /tags (successfully)", () => {
    it("successfully creates a new tag", async () => {
        const tagPool = [
            {
                "userid": 1,
                "name": "Normal tag"
            },
            {
                "userid": 2,
                "name": "!"
            },
            {
                "userid": 2,
                "name": ":)"
            }
        ];

        const { statusCode } = await request(app)
            .post('/tags')
            .send(rand(tagPool));
        expect(statusCode).toBe(201);
    });
});

describe("POST /tags (bad request)", () => {
    it("fails to create a new tag due to missing fields", async () => {
        const tagPool = [
            {
                "userid": 1,
                "name": ""
            },
            {
                "userid": 2,
                "name": ""
            },
            {
                "userid": "",
                "name": ":)"
            }
        ];

        const { statusCode } = await request(app)
            .post('/tags')
            .send(rand(tagPool));
        expect(statusCode).toBe(400);
    });
});

// READ /tags

describe("GET /tags", () => {
    it("returns all of the database's tags", async () => {
        const { statusCode } = await request(app).get('/tags');
        expect(statusCode).toBe(200);
    });
});

describe("GET /tags/:id", () => {
    it("returns a specific tag by ID", async () => {
        const { statusCode } = await request(app).get(`/tags/${randInt(1, 2)}`);
        expect(statusCode).toBe(200);
    });
});

describe("GET /tags querying by user", () => {
    it("returns all of user's notes", async () => {
        const { statusCode } = await request(app).get(`/tags?userid=${randInt(1, 2)}`);
        expect(statusCode).toBe(200);
    });
});

describe("GET /tags querying by user (bad request)", () => {
    it("returns 404 error because user does not exist", async () => {
        const { statusCode, res } = await request(app).get(`/tags?userid=0`);
        expect(statusCode).toBe(404);
        expect(asJSON(res.text)).toHaveProperty("error", "No tags were found");
    });
});

describe("POST & GET /tags", () => {
    it("creates a tag, then tries to query it right after", async () => {
        const tagPool = [
            {
                "userid": 1,
                "name": "Cool!"
            },
            {
                "userid": 2,
                "name": "[!]"
            },
            {
                "userid": 2,
                "name": ":O"
            }
        ];

        picked = rand(tagPool);
        console.log(picked);

        const { statusCode: postStatusCode, res } = await request(app)
            .post('/tags')
            .send(picked);
        expect(postStatusCode).toBe(201);

        const { statusCode: getStatusCode } = await request(app).get(`/tags/${asJSON(res.text)[0].tagid}`);
        expect(getStatusCode).toBe(200);
    });
});