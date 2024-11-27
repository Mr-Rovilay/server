// @ts-ignore
import express from 'express';

import { isAuthenticated } from "../middleware/isAuthenticated";
import { createCheckoutSession, getOrders, stripeWebhook } from "../controllers/orderController";

const router = express.Router();

router.route("/").get(isAuthenticated, getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(express.raw({type: 'application/json'}), stripeWebhook);

export default router;