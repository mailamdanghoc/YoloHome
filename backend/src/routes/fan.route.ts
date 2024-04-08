import express from "express";
const router = express.Router();

import fanController from "../controllers/fan.controller";

router.get("/", fanController.find);
router.get("/newest", fanController.findNewest.bind(fanController));
router.get("/usage", fanController.getUsedTimeByInterval.bind(fanController));

router.post("/control", fanController.control.bind(fanController));

export default router;
