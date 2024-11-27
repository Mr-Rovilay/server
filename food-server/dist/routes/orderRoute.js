"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.route("/").get(isAuthenticated_1.isAuthenticated, orderController_1.getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated_1.isAuthenticated, orderController_1.createCheckoutSession);
router.route("/webhook").post(express_1.default.raw({ type: 'application/json' }), orderController_1.stripeWebhook);
exports.default = router;
