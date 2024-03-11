import express from 'express'
import { getNoteById, getAllNotes, createNote, deleteNote, getTagById, getAllTags, getTagByName, createTag} from './database.js'

const app = express();
app.use(express.json());

app.get("/notes", async (req, res) => {
    try{
        const notes = await getAllNotes();

        if(notes.length === 0){
            res.status(404).json({error: "No notes were found"});
        }else{
            res.status(201).send(notes);
        }
    }catch(err){
        res.status(404).json({error: "No notes were found"});
    }
})

app.get("/note/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const note = await getNoteById(id);
        
        if(note.length === 0){
            res.status(404).json({error: "Your notes was not found"});
        }else {
            res.status(201).send(note);
        }

    }catch(err){
        res.status(404).json({error: "No notes were found"});
    }
})

app.post("/notes", async (req, res) => {
    try{
        const {title, content, url} = req.body;
        const note = await createNote(title, content, url);

        if(note.length === 0){
            res.status(404).json({error: "Your note was not found"});
        }else {
            res.status(201).send(note);
        }
    }catch(err){
        res.status(404).json({error: "Your note was not found"});
    }
})

app.delete("/note/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const note = await deleteNote(id);
        res.status(201).send(note);
    }catch(err){
        res.status(404).json({error: "Your note was not deleted"});
    }
})

app.get("/tags", async (req, res) => {
    try{
        const tags = await getAllTags();

        if(tags.length === 0){
            res.status(404).json({error: "No tags were found"});
        }else{
            res.status(201).send(tags);
        }
    }catch(err){
        res.status(404).json({error: "No tags were found"});
    }
})

app.get("/tag/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const tag = await getTagById(id);
        
        if(tag.length === 0){
            res.status(404).json({error: "No tag was not found"});
        }else {
            res.status(201).send(tag);
        }

    }catch(err){
        res.status(404).json({error: "No tag were found"});
    }
})

app.get("/lookuptag/:tag", async (req, res) => {
    try{
        const tag = req.params.tag;
        const lookedupTag = await getTagByName(tag);
        
        if(lookedupTag.length === 0){
            res.status(404).json({error: "Your tag was not found"});
        }else {
            res.status(201).send(lookedupTag);
        }

    }catch(err){
        res.status(404).json({error: "No notes were found"});
    }
})

app.post("/tags", async (req,res) => {
    try{
        const {tag} = req.body;
        const newtag = await createTag(tag);

        if(newtag.length === 0){
            res.status(404).json({error: "No tag was created"});
        }else {
            res.status(201).send(newtag);
        }
    }catch(err){
        res.status(404).json({error: "No tag was created"});
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})