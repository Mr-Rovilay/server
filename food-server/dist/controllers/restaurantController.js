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
exports.getSingleRestaurant = exports.searchRestaurant = exports.updateOrderStatus = exports.getRestaurantOrder = exports.updateRestaurant = exports.getRestaurant = exports.createRestaurant = void 0;
const restaurantModel_1 = require("../models/restaurantModel");
const imageUpload_1 = __importDefault(require("../utils/imageUpload"));
const orderModel_1 = require("../models/orderModel");
const createRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantName, city, country, deliveryTime, rating, cuisines, reviews, description, address, openingHours, phone, website, instagram, facebook, } = req.body;
        const file = req.file;
        const restaurant = yield restaurantModel_1.Restaurant.findOne({ user: req.id });
        if (restaurant) {
            res.status(400).json({
                success: false,
                message: "Restaurant already exist for this user",
            });
            return;
        }
        if (!file) {
            res.status(400).json({
                success: false,
                message: "Image is required",
            });
            return;
        }
        const imageUrl = yield (0, imageUpload_1.default)(file);
        yield restaurantModel_1.Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            rating,
            reviews,
            description,
            address,
            openingHours,
            phone,
            website,
            instagram,
            facebook,
            cuisines: JSON.parse(cuisines),
            imageUrl,
        });
        res.status(201).json({
            success: true,
            message: "Restaurant Added",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.createRestaurant = createRestaurant;
const getRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurantModel_1.Restaurant.findOne({ user: req.id }).populate("menus");
        if (!restaurant) {
            res.status(404).json({
                success: false,
                restaurant: [],
                message: "Restaurant not found",
            });
            return;
        }
        res.status(200).json({ success: true, restaurant });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.getRestaurant = getRestaurant;
const updateRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantName, city, country, deliveryTime, rating, cuisines, reviews, description, address, openingHours, phone, website, instagram, facebook, } = req.body;
        const file = req.file;
        const restaurant = yield restaurantModel_1.Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }
        restaurant.restaurantName = restaurantName;
        restaurant.rating = rating;
        restaurant.city = city;
        restaurant.reviews = reviews;
        restaurant.description = description;
        restaurant.address = address;
        restaurant.openingHours = openingHours;
        restaurant.phone = phone;
        restaurant.website = website;
        restaurant.instagram = instagram;
        restaurant.facebook = facebook;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);
        if (file) {
            const imageUrl = yield (0, imageUpload_1.default)(file);
            restaurant.imageUrl = imageUrl;
        }
        yield restaurant.save();
        res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.updateRestaurant = updateRestaurant;
const getRestaurantOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurantModel_1.Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
            return;
        }
        ;
        const orders = yield orderModel_1.Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
        res.status(200).json({
            success: true,
            orders
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.getRestaurantOrder = getRestaurantOrder;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = yield orderModel_1.Order.findById(orderId);
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
            return;
        }
        order.status = status;
        yield order.save();
        res.status(200).json({
            success: true,
            status: order.status,
            message: "Status updated"
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.updateOrderStatus = updateOrderStatus;
const searchRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = (req.query.selectedCuisines || "").split(",").filter(cuisine => cuisine);
        const query = {};
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
                { cuisines: { $regex: searchText, $options: 'i' } }
            ];
        }
        // filter on the basis of searchQuery
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        // console.log(query);
        // ["momos", "burger"]
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines };
        }
        const restaurants = yield restaurantModel_1.Restaurant.find(query);
        res.status(200).json({
            success: true,
            data: restaurants
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.searchRestaurant = searchRestaurant;
const getSingleRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.id;
        const restaurant = yield restaurantModel_1.Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { createdAt: -1 }
        });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
            return;
        }
        ;
        res.status(200).json({ success: true, restaurant });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.getSingleRestaurant = getSingleRestaurant;
