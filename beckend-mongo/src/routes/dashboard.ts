import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.js";
import authenticate from "../middlewares/authenticate.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", authenticate, getDashboardStats);

export default dashboardRouter;
