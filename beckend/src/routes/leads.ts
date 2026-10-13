import express from "express";
const leadsRouter = express.Router();
import {
  leadsGet,
  leadGetById,
  leadCreate,
  leadUpdate,
  leadDelete,
} from "../controllers/leads.js";
import authenticate from "../middlewares/authenticate.js";
import { zodValidate } from "../lib/zodValidator.js";
import { leadZodSchema } from "../lib/zodSchema.js";

leadsRouter
  .get("/", authenticate, leadsGet)
  .get("/:id", authenticate, leadGetById)
  .post("/", authenticate, zodValidate(leadZodSchema), leadCreate)
  .patch(
    "/:id",
    authenticate,
    zodValidate(leadZodSchema.partial()),
    leadUpdate,
  )
  .delete("/:id", authenticate, leadDelete);

export default leadsRouter;
