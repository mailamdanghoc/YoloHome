import express from "express";
const router = express.Router();

import deviceController from "../controllers/device.controller";

router
  .get("/", deviceController.findAll.bind(deviceController))
  .post("/", deviceController.create.bind(deviceController));

router
  .get("/:deviceId", deviceController.findById.bind(deviceController))
  .patch("/:deviceId", deviceController.updateOne.bind(deviceController))
  .delete("/:deviceId", deviceController.deleteOne.bind(deviceController));

export default router;
