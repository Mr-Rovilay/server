"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = exports.NigerianDelicacyCategory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Enum for Nigerian delicacy categories
var NigerianDelicacyCategory;
(function (NigerianDelicacyCategory) {
    NigerianDelicacyCategory["SOUPS"] = "Soups";
    NigerianDelicacyCategory["RICE_DISHES"] = "Rice Dishes";
    NigerianDelicacyCategory["SWALLOWS"] = "Swallows";
    NigerianDelicacyCategory["MAIN_COURSE"] = "Main Course";
    NigerianDelicacyCategory["STEWS"] = "Stews";
    NigerianDelicacyCategory["GRILLED"] = "Grilled";
    NigerianDelicacyCategory["DRINKS"] = "Drinks";
    NigerianDelicacyCategory["DESSERTS"] = "Desserts";
    NigerianDelicacyCategory["APPETIZERS"] = "Appetizer";
})(NigerianDelicacyCategory || (exports.NigerianDelicacyCategory = NigerianDelicacyCategory = {}));
// Combined menu schema
const menuSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"],
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: Object.values(NigerianDelicacyCategory),
        required: true,
    },
}, { timestamps: true });
exports.Menu = mongoose_1.default.model("Menu", menuSchema);