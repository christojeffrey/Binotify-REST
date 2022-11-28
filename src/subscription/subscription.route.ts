import express from "express";
import UserRouter from "../user/user.route";
import { updateSubscription, getAllSubscriptionRequests } from "./subscription.controller";
const SubscriptionRouter = express.Router();

// subcription/:id
UserRouter.patch("/subscription/:creator_id", updateSubscription);
UserRouter.get("/subscription/getAllSubscriptionRequests", getAllSubscriptionRequests);

export default SubscriptionRouter;
