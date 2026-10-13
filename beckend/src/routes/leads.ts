import express from "express";
const leadsRouter = express.Router();
import {
  leadsGet,
  leadGetById,
  leadCreate,
  leadUpdate,
  leadDelete,
} from "../controllers/leads.js";

leadsRouter
  .get("/notes", leadsGet)
  .get("/notes/:id", leadGetById)
  .post("/notes", leadCreate)
  .patch("/notes/:id", leadUpdate)
  .delete("/notes/:id", leadDelete);

export default leadsRouter;
