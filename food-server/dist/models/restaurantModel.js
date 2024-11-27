"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const restaurantSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    address: {
        type: String,
        required: true
    },
    openingHours: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    },
    facebook: {
        type: String,
        default: ""
    },
    deliveryTime: {
        type: Number,
        required: true
    },
    cuisines: [{
            type: String,
            required: true
        }],
    menus: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Menu'
        }],
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.Restaurant = mongoose_1.default.model("Restaurant", restaurantSchema);
