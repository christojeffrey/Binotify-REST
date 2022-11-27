import express from "express";
import UserRouter from "../user/user.route";
import { updateSubscription } from "./subscription.controller";
const SubscriptionRouter = express.Router();

// subcription/:id
UserRouter.patch("/subscription/:creator_id", updateSubscription);

export default SubscriptionRouter;
