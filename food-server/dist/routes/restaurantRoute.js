"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const multer_1 = __importDefault(require("../middleware/multer"));
const restaurantController_1 = require("../controllers/restaurantController");
const router = express_1.default.Router();
router.route("/").post(isAuthenticated_1.isAuthenticated, multer_1.default.single("imageFile"), restaurantController_1.createRestaurant);
router.route("/").get(isAuthenticated_1.isAuthenticated, restaurantController_1.getRestaurant);
router.route("/").put(isAuthenticated_1.isAuthenticated, multer_1.default.single("imageFile"), restaurantController_1.updateRestaurant);
router.route("/order").get(isAuthenticated_1.isAuthenticated, restaurantController_1.getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated_1.isAuthenticated, restaurantController_1.updateOrderStatus);
router.route("/search/:searchText").get(isAuthenticated_1.isAuthenticated, restaurantController_1.searchRestaurant);
router.route("/:id").get(isAuthenticated_1.isAuthenticated, restaurantController_1.getSingleRestaurant);
exports.default = router;
