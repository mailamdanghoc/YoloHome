import express from "express";
const router = express.Router();

import humidController from "../controllers/humidity.controller";

router.get("/", humidController.getAvgDataByInterval.bind(humidController));

export default router;
