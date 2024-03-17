import express from 'express';
import { getNoteById, getAllNotes, createNote, deleteNote, getTagById, getAllTags, getTagByName, createTag, getAllLabels, getNotesByAssignedTag, getAllNotesWithTags, createLabel, updateTag, getTagsOnNote } from './database.js';

const app = express();
app.use(express.json());

//#region --- /notes ROUTES

// CREATE new note
app.post("/notes", async (req, res) => {
    try {
        const { title, content, url } = req.body;
        const note = await createNote(title, content, url);

        if (note.length === 0) {
            res.status(500).json({ error: `Error posting new note with title=${title} linked to url=${url} <NOT FOUND IN DATABASE>` });
        } else {
            res.status(201).send(note);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ all notes
app.get("/notes", async (req, res) => {
    try {
        const notes = await getAllNotes();

        if (notes.length === 0) {
            res.status(404).json({ error: "No notes were found" });
        } else {
            res.status(201).send(notes);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ note by ID
app.get("/notes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const note = await getNoteById(id);

        if (note.length === 0) {
            res.status(404).json({ error: `Requested note with id=${id} not found` });
        } else {
            res.status(201).send(note);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ all notes associated with a tag NAME
app.get('/notes/tags/:name', async (req, res) => {
    try {
        const tag = req.params.name;
        const notes = await getNotesByAssignedTag(tag);

        if (notes.length === 0) {
            res.status(404).json({ error: "No tags were found" });
        } else {
            res.status(201).send(notes);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ all tags associated with a note
app.get("/notes/:noteid/tags/", async (req, res) => {
    try {
        const noteid = req.params.noteid;
        const tags = await getTagsOnNote(noteid);

        if (tags.length === 0) {
            res.status(404).json({ error: `Note with id=${noteid} does not exist or has no tags` });
        } else {
            res.status(201).send(tags);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// UPDATE a note's tags by name IN THE BODY
app.post("/notes/:noteid/tags/", async (req, res) => {
    try {
        const noteid = req.params.noteid;
        const tagName = req.body.tag;
        const lookup = await getTagByName(tagName);

        console.log(lookup);

        if (lookup.length === 0) {
            const newtag = await createTag(tagName);
            const updatedNote = await updateTag(newtag.tagid, noteid);

            if (updatedNote.length === 0) {
                res.status(404).json({ error: "The tag was not updated" });
            } else {
                res.status(201).send(updatedNote);
            }
        } else {

            const updatedNote = await createLabel(noteid, lookup[0].tagid);

            if (updatedNote.length === 0) {
                res.status(404).json({ error: "The tag was not updated" });
            } else {
                res.status(201).send(updatedNote);
            }
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// DELETE note by ID
app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const note = await getNoteById(id);

        if (note == undefined) {
            res.status(404).send(`Couldn't delete. Requested note with id=${id} not found.`);
        } else {
            await deleteNote(id);
            res.status(200).send(note);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//#endregion

//#region --- /tags ROUTES

// CREATE new tag
app.post("/tags", async (req, res) => {
    try {
        const { tag } = req.body;
        const newtag = await createTag(tag);

        if (newtag.length === 0) {
            res.status(404).json({ error: "No tag was created" });
        } else {
            res.status(201).send(newtag);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ all tags
app.get("/tags", async (req, res) => {
    try {
        const tags = await getAllTags();

        if (tags.length === 0) {
            res.status(404).json({ error: "No tags were found" });
        } else {
            res.status(201).send(tags);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


// READ tag by ID
app.get("/tags/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await getTagById(id);

        if (tag.length === 0) {
            res.status(404).json({ error: `Requested tag with id=${id} not found` });
        } else {
            res.status(201).send(tag);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// TODO: FIGURE OUT THIS ROUTE'S NAMING
app.get("/tags/name/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const lookedupTag = await getTagByName(name);

        if (lookedupTag.length === 0) {
            res.status(404).json({ error: `Your tag was not found with parameters name=${name}` });
        } else {
            res.status(201).send(lookedupTag);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//#endregion

//#region --- /label ROUTES

// CREATE new label relationship
app.post("/label", async (req, res) => {
    try {
        const { NoteId, TagId } = req.body;
        const newtag = await createLabel(NoteId, TagId);

        if (newtag.length === 0) {
            res.status(404).json({ error: "Your tag was not created" });
        } else {
            res.status(201).send(newtag);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ all label relationships
app.get("/label", async (req, res) => {
    try {
        const label = await getAllLabels();

        if (label.length === 0) {
            res.status(404).json({ error: "No notes with tags were found" });
        } else {
            res.status(201).send(label);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// TODO: not necessary?
// READ all notes that have tags?
app.get("/NotesandTags", async (req, res) => {
    try {
        const NotesandTags = await getAllNotesWithTags();

        if (NotesandTags.length === 0) {
            res.status(404).json({ error: "No notes and tags were found" });
        } else {
            res.status(201).send(NotesandTags);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// TODO: remove this and turn into two requests?
// CREATE a note and then CREATE a tag relationship
app.post("/addTagToNote", async (req, res) => {
    try {
        const { title, content, url, tag } = req.body;

        const lookedupTag = await getTagByName(tag);

        if (lookedupTag.length === 0) {
            const newtag = await createTag(tag);
            const note = await createNote(title, content, url);
            const newNote = await createLabel(note.noteid, newtag.tagid);

            if (newNote.length === 0) {
                res.status(404).json({ error: "Your Note and tag was not found" });
            } else {
                res.status(201).send(newNote);
            }
        } else {
            const note = await createNote(title, content, url);
            const newNote = await createLabel(note.noteid, lookedupTag[0].tagid);

            if (newNote.length === 0) {
                res.status(404).json({ error: "Your note and tag was not found" });
            } else {
                res.status(201).send(newNote);
            }
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//#endregion

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});