import express from 'express';
import { getNoteById, getAllNotes, createNote, deleteNote, getTagById, getAllTags, getTagByName, createTag, getAllLabels, getAllNotesWithTags, createLabel, updateTag, getTagsOnNote, updateTagName, deleteTagById, getNotesByAssignedTagId } from './database.js';

const app = express();
app.use(express.json());

//#region --- /notes ROUTES

// CREATE new note
app.post("/notes", async (req, res) => {
    try {
        const { title, content, url } = req.body;
        const note = await createNote(title, content, url);

        if (note.length === 0) {
            res.status(500).json({ error: `Unknown error posting new note with title=${title} linked to url=${url}` });
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
            res.status(200).send(notes);
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
            res.status(404).json({ error: `Note with id=${id} not found.` });
        } else {
            res.status(200).send(note);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ all tags associated with a note
app.get("/notes/:id/tags", async (req, res) => {
    try {
        const { id } = req.params;
        const notes = await getNoteById(id);
        const tags = await getTagsOnNote(id);

        if (notes.length === 0) {
            res.status(404).json({ error: `Note with id=${id} not found.` });
        } else if (tags.length === 0) {
            res.status(404).json({ error: `Note with id=${id} has no tags.` });
        } else {
            res.status(200).send(tags);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// UPDATE a note's tags by name IN THE BODY
app.post("/notes/:id/tags", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const tagLookup = await getTagByName(name);
        const noteLookup = await getNoteById(id);

        if (tagLookup.length === 0) {
            res.status(404).json({ error: `Tag with name=${name} not found.` });
        } else if (noteLookup.length === 0) {
            res.status(404).json({ error: `Note with id=${id} not found.` });
        } else {
            const updatedNote = await createLabel(id, tagLookup[0].tagid);

            if (updatedNote.length === 0) {
                res.status(404).json({ error: "The tag was not updated" });
            } else {
                res.status(200).send(updatedNote);
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

// CREATE new tag using the body
app.post("/tags", async (req, res) => {
    try {
        const { name } = req.body;
        const tagLookup = await getTagByName(name);

        if (tagLookup.length !== 0) {
            res.status(400).json({ error: `Tag with name=${name} already exists.` });
        }

        const newTag = await createTag(name);

        if (newTag.length === 0) {
            res.status(404).json({ error: `Failed to create tag with name=${name}` });
        } else {
            res.status(201).send(newTag);
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
            res.status(200).send(tags);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


// READ tag by ID
app.get("/tags/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await getTagById(id);

        if (tag.length === 0) {
            res.status(404).json({ error: `Requested tag with id=${id} not found` });
        } else {
            res.status(200).send(tag);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ tag by name
app.get("/tags/name/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const lookedupTag = await getTagByName(name);

        if (lookedupTag.length === 0) {
            res.status(404).json({ error: `Your tag was not found with parameters name=${name}` });
        } else {
            res.status(200).send(lookedupTag);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// READ all notes associated with a tag id
app.get('/tags/:id/notes', async (req, res) => {
    try {
        const { id } = req.params;
        const notes = await getNotesByAssignedTagId(id);

        if (notes.length === 0) {
            res.status(404).json({ error: `No notes associated with tag with id=${id}` });
        } else {
            res.status(200).send(notes);
        }

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// UPDATE tag by id
app.post("/tags/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const newTag = await updateTagName(id, name);

        if (newTag.length === 0) {
            res.status(404).json({ error: `Tag with id=${id} failed to update` });
        } else {
            res.status(200).send(newTag);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// DELETE tag by id
app.delete("/tags/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await getTagById(id);

        if (tag == undefined) {
            res.status(404).json({ error: `Couldn't delete tag. Requested tag with id=${id} doesn't exist.` });
        } else {
            await deleteTagById(id);
            res.status(200).send(tag);
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

//#endregion

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});