import express from "express";
const route = express.Router();

import ledController from "../controllers/led.controller";

route.get("/", ledController.find);
route.get(
  "/newest",
  (req, res, next) => {
    req.query.limit = "1";
    next();
  },
  ledController.find
);

route.post("/turnon", ledController.turnon.bind(ledController));
route.post("/turnoff", ledController.turnoff.bind(ledController));

export default route;
