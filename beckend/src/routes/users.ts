import express from "express";
const usersRouter = express.Router();
import {
  usersGet,
  userGetById,
  userDelete,
  currentUserGet,
} from "../controllers/users.js";
import authenticate from "../middlewares/authenticate.js";

usersRouter
  .get("/", authenticate, usersGet)
  .get("/current-user", authenticate, currentUserGet)
  .get("/:id", authenticate, userGetById)
  .delete("/:id", authenticate, userDelete);

export default usersRouter;
