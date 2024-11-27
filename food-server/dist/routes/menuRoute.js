"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const multer_1 = __importDefault(require("../middleware/multer"));
const menuController_1 = require("../controllers/menuController");
const router = express_1.default.Router();
router.route("/").post(isAuthenticated_1.isAuthenticated, multer_1.default.single("image"), menuController_1.addMenu);
router.route("/:id").put(isAuthenticated_1.isAuthenticated, multer_1.default.single("image"), menuController_1.editMenu);
exports.default = router;
