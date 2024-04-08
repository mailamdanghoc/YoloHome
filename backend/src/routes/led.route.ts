import express from "express";
const router = express.Router();

import ledController from "../controllers/led.controller";

router.get("/", ledController.find);
router.get("/newest", ledController.findNewest.bind(ledController));
router.get("/usage", ledController.getUsedTimeByInterval.bind(ledController));

router.post("/turnon", ledController.turnon.bind(ledController));
router.post("/turnoff", ledController.turnoff.bind(ledController));

export default router;
