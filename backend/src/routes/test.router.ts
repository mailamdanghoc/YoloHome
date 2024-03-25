import express from "express";
const route = express.Router();

import testController from "../controller/test.controller";

route.get("/", testController.test);

export default route;
