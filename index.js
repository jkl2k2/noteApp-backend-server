import express from 'express';
import { getNoteById, getAllNotes, createNote, deleteNote, getTagById, getAllTags, getTagByName, createTag, getAllLabels, getNotesByAssignedTag, getAllNotesWithTags, createLabel, updateTag } from './database.js';

const app = express();
app.use(express.json());

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

app.get("/note/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const note = await getNoteById(id);

        if (note.length === 0) {
            res.status(404).json({ error: "Your notes was not found" });
        } else {
            res.status(201).send(note);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.post("/notes", async (req, res) => {
    try {
        const { title, content, url } = req.body;
        const note = await createNote(title, content, url);

        if (note.length === 0) {
            res.status(404).json({ error: "Your note was not found" });
        } else {
            res.status(201).send(note);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.delete("/note/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const note = await deleteNote(id);
        res.status(201).send(note);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

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

app.get("/tag/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await getTagById(id);

        if (tag.length === 0) {
            res.status(404).json({ error: "No tag was not found" });
        } else {
            res.status(201).send(tag);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.get("/lookuptag/:tag", async (req, res) => {
    try {
        const tag = req.params.tag;
        const lookedupTag = await getTagByName(tag);

        if (lookedupTag.length === 0) {
            res.status(404).json({ error: "Your tag was not found" });
        } else {
            res.status(201).send(lookedupTag);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

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

app.get("/labels", async (req, res) => {
    try {
        const label = await getAllLabels();

        if (label.length === 0) {
            res.status(404).json({ error: "No notes with that tag  were found" });
        } else {
            res.status(201).send(label);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.post("/newlabel", async (req, res) => {
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

app.get('/note/tag/:tag', async (req, res) => {
    try {
        const tag = req.params.tag;
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

app.post("/updateNote/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { tag } = req.body;
        const lookup = await getTagByName(tag);

        if (lookup.length === 0) {
            const newtag = await createTag(tag);
            const updatedNote = await updateTag(newtag.tagid, id);

            if (updatedNote.length === 0) {
                res.status(404).json({ error: "The tag was not updated" });
            } else {
                res.status(201).send(updatedNote);
            }
        } else {

            const updatedNote = await updateTag(lookup[0].tagid, id);

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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});