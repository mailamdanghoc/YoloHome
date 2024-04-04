import MQTTService from "../services/mqtt.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { Request, Response } from "express";
import {
  ADAFRUIT_IO_USERNAME,
  ADAFRUIT_IO_KEY,
  ADAFRUIT_IO_FEEDS,
} from "../config/adafruit";
import { ControlType, LedRecordModel } from "../models/record.model";

export class LedController implements Subscriber {
  public mqttService: MQTTService;
  public name = ADAFRUIT_IO_FEEDS + "led";

  constructor() {
    this.mqttService = new MQTTService(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY);
    this.mqttService.subscribe(this);
    this.mqttService.addTopic([this.name]);
  }

  async update(context: IContext) {
    await LedRecordModel.create({
      status: context.payload === "1",
      controlType: ControlType.MANUAL,
      description: `LED was turned ${context.payload === "1" ? "on" : "off"}`,
    });
  }

  turnon(req: Request, res: Response) {
    this.mqttService.sendMessage(this.name, "1");
    res.json({ message: "LED has been turned on successfully." });
  }

  turnoff(req: Request, res: Response) {
    this.mqttService.sendMessage(this.name, "0");
    res.json({ message: "LED has been turned off successfully." });
  }

  async find(req: Request, res: Response) {
    const limit = req.query.limit;

    const dateOption = {};
    if (req.body.startDate) {
      dateOption["$gte"] = new Date(req.body.startDate);
    }
    if (req.body.endDate) {
      dateOption["$lte"] = new Date(req.body.endDate);
    }

    const query = LedRecordModel.find(
      Object.keys(dateOption).length === 0 && dateOption.constructor === Object
        ? {}
        : { timestamp: dateOption }
    ).sort({
      timestamp: -1,
    });

    if (limit !== undefined) {
      query.limit(parseInt(limit.toString()));
    }

    const data = await query.exec();
    res.json({ data: data });
  }
}

export default new LedController();
