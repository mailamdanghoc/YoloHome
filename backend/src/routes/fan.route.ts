import express from "express";
const route = express.Router();

import fanController from "../controllers/fan.controller";

route.get("/", fanController.find);
route.get(
  "/newest",
  (req, res, next) => {
    req.query.limit = "1";
    next();
  },
  fanController.find
);

route.post("/control", fanController.control.bind(fanController));

export default route;
