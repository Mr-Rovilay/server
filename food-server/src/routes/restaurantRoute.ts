// @ts-ignore
import express from 'express';

import { isAuthenticated } from "../middleware/isAuthenticated";
import upload from "../middleware/multer";
import { createRestaurant, getRestaurant, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant,getRestaurantOrder } from "../controllers/restaurantController";



const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant);
router.route("/order").get(isAuthenticated,  getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/search/:searchText").get(isAuthenticated, searchRestaurant);
router.route("/:id").get(isAuthenticated, getSingleRestaurant);

export default router;


