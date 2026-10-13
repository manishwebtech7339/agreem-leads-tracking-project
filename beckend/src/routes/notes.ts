import express from "express";
import {
  notesGet,
  noteGetById,
  noteCreate,
  noteUpdate,
  noteDelete,
} from "../controllers/notes.js";
const notesRouter = express.Router();
notesRouter
  .get("/notes", notesGet)
  .get("/notes/:id", noteGetById)
  .post("/notes", noteCreate)
  .patch("/notes/:id", noteUpdate)
  .delete("/notes/:id", noteDelete);
export default notesRouter;
