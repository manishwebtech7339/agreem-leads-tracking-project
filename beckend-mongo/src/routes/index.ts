import { Router } from "express";

import authRouter from "./auth.js";
import leadsRouter from "./leads.js";
import notesRouter from "./notes.js";
import usersRouter from "./users.js";
import dashboardRouter from "./dashboard.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/leads", leadsRouter);
router.use("/notes", notesRouter);
router.use("/users", usersRouter);
router.use("/dashboard", dashboardRouter);

export default router;
