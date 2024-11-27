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
exports.editMenu = exports.addMenu = void 0;
const imageUpload_1 = __importDefault(require("../utils/imageUpload"));
const menuModel_1 = require("../models/menuModel");
const restaurantModel_1 = require("../models/restaurantModel");
const addMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({
                success: false,
                message: "Image is required"
            });
            return;
        }
        ;
        if (!Object.values(menuModel_1.NigerianDelicacyCategory).includes(category)) {
            res.status(400).json({
                success: false,
                message: "Invalid category",
            });
            return;
        }
        const imageUrl = yield (0, imageUpload_1.default)(file);
        const menu = yield menuModel_1.Menu.create({
            name,
            description,
            price,
            category,
            image: imageUrl
        });
        const restaurant = yield restaurantModel_1.Restaurant.findOne({ user: req.id });
        if (restaurant) {
            restaurant.menus.push(menu._id);
            yield restaurant.save();
        }
        res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.addMenu = addMenu;
const editMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;
        const file = req.file;
        const menu = yield menuModel_1.Menu.findById(id);
        if (!menu) {
            res.status(404).json({
                success: false,
                message: "Menu not found!"
            });
            return;
        }
        if (name)
            menu.name = name;
        if (description)
            menu.description = description;
        if (price)
            menu.price = price;
        if (category)
            menu.category = category; // Update category
        if (file) {
            const imageUrl = yield (0, imageUpload_1.default)(file);
            menu.image = imageUrl;
        }
        yield menu.save();
        res.status(200).json({
            success: true,
            message: "Menu updated",
            menu,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.editMenu = editMenu;
