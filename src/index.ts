import express from "express";
import { Request, Response } from "express";
const port = process.env.PORT || 3000;
import UserRouter from "./user/user.route";
import SongRouter from "./song/song.route";
import SubscriptionRouter from "./subscription/subscription.route";
let morgan = require("morgan");

// setupe express app
const app = express();
app.use(express.json());

// enable cors
let cors = require("cors");
app.use(cors());

// log requests
app.use(morgan("combined"));

// setup routes
app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use("/", UserRouter);
app.use("/", SongRouter);
app.use("/", SubscriptionRouter);

// start server
app.listen(port, () => {
  console.log(`Binotify REST app listening at http://localhost:${port}`);
});
