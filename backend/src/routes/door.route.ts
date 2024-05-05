import express from "express";
const router = express.Router();

import doorController from "../controllers/door.controller";

router.get("/", doorController.getAllDoorStatus.bind(doorController));

export default router;
