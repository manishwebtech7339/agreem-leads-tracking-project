import { Router } from "express";

import authRouter from "./auth.js";
import leadsRouter from "./leads.js";
import notesRouter from "./notes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/leads", leadsRouter);
router.use("/notes", notesRouter);

export default router;
