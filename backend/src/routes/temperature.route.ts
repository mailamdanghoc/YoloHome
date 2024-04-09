import express from "express";
const router = express.Router();

import tempController from "../controllers/temperature.controller";

router.get("/", tempController.getAvgDataByInterval.bind(tempController));

export default router;
