import express from "express";
import { notesController } from "../controllers/notes.controller";

const noteRouter = express.Router();

noteRouter.get("/getAllNote", notesController.getAllNote);

// GET /getNoteById?noteId=<id>   (GET requests have no body)
noteRouter.get("/getNoteById", notesController.getNotesById);

noteRouter.post("/createNote", notesController.createNote);

noteRouter.put("/updateNote", notesController.updateNote);

noteRouter.delete("/deleteNote", notesController.deleteNote);

export default noteRouter;
