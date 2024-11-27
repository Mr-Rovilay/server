"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLineItems = exports.stripeWebhook = exports.createCheckoutSession = exports.getOrders = void 0;
const stripe_1 = __importDefault(require("stripe"));
const orderModel_1 = require("../models/orderModel");
const restaurantModel_1 = require("../models/restaurantModel");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.Order.find({ user: req.id }).populate('user').populate('restaurant');
        res.status(200).json({
            success: true,
            orders
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
});
exports.getOrders = getOrders;
const createCheckoutSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkoutSessionRequest = req.body;
        const restaurant = yield restaurantModel_1.Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found."
            });
            return;
        }
        ;
        const order = new orderModel_1.Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending"
        });
        // line items
        const menuItems = restaurant.menus;
        const lineItems = (0, exports.createLineItems)(checkoutSessionRequest, menuItems);
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item) => item.image))
            }
        });
        if (!session.url) {
            res.status(400).json({ success: false, message: "Error while creating session" });
            return;
        }
        yield order.save();
        res.status(200).json({
            session
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.createCheckoutSession = createCheckoutSession;
const stripeWebhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let event;
    try {
        const signature = req.headers["stripe-signature"];
        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
        // Generate test header string for event construction
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        // Construct the event using the payload string and header
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    }
    catch (error) {
        console.error('Webhook error:', error.message);
        res.status(400).send(`Webhook error: ${error.message}`);
    }
    // Handle the checkout session completed event
    if (event && event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;
            const order = yield orderModel_1.Order.findById((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return; // Ensure to return after sending the response
            }
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";
            yield order.save();
        }
        catch (error) {
            console.error('Error handling event:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // Send a 200 response to acknowledge receipt of the event
    res.status(200).send();
});
exports.stripeWebhook = stripeWebhook;
const createLineItems = (checkoutSessionRequest, menuItems) => {
    // 1. create line items
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuId);
        if (!menuItem)
            throw new Error(`Menu item id not found`);
        return {
            price_data: {
                currency: 'ngn',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100
            },
            quantity: cartItem.quantity,
        };
    });
    // 2. return lineItems
    return lineItems;
};
exports.createLineItems = createLineItems;
