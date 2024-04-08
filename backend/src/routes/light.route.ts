import express from "express";
const router = express.Router();

import lightController from "../controllers/light.controller";

router.get("/", lightController.getAvgDataByInterval.bind(lightController));

export default router;
