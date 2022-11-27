import express from "express";
const UserRouter = express.Router();
import { register, login, getAllSinger } from "./user.controller";

// UserRouter.get('/user', getAll)
UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.get("/singer", getAllSinger);

export default UserRouter;
