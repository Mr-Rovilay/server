// @ts-ignore
import express from 'express';

import { isAuthenticated } from "../middleware/isAuthenticated";
import upload from "../middleware/multer";
import { addMenu, editMenu } from "../controllers/menuController";


const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("image"), addMenu);
router.route("/:id").put(isAuthenticated, upload.single("image"), editMenu);
 
export default router;


