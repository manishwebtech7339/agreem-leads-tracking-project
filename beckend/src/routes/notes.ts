import express from "express";
import {
  notesGet,
  noteGetById,
  noteCreate,
  noteUpdate,
  noteDelete,
} from "../controllers/notes.js";
import authenticate from "../middlewares/authenticate.js";
import { zodValidate } from "../lib/zodValidator.js";
import { leadNoteZodSchema } from "../lib/zodSchema.js";
const notesRouter = express.Router();
notesRouter
  .get("/", authenticate, notesGet)
  .get("/:id", authenticate, noteGetById)
  .post("/", authenticate, zodValidate(leadNoteZodSchema), noteCreate)
  .patch(
    "/:id",
    authenticate,
    zodValidate(leadNoteZodSchema.partial()),
    noteUpdate,
  )
  .delete("/:id", authenticate, noteDelete);
export default notesRouter;
