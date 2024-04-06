import MQTTService from "../services/mqtt.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { ADAFRUIT_IO_FEEDS } from "../config/adafruit";
import { Request, Response } from "express";
import { ControlType, FanRecordModel } from "../models/record.model";

export class FanController implements Subscriber {
  private mqttService: MQTTService;
  readonly name = ADAFRUIT_IO_FEEDS + "fan";

  constructor() {
    this.mqttService = MQTTService.getInstance();
    this.mqttService.subscribe(this);
    this.mqttService.addTopic(this.name);
  }

  async update(context: IContext) {
    // io.emit("fan", context)
    await FanRecordModel.create({
      speed: parseInt(context.payload),
      controlType: ControlType.MANUAL,
    });
  }

  control(req: Request, res: Response) {
    const speed: string = req.body.speed;
    const speedInt = parseInt(req.body.speed);

    if (typeof speed === "undefined") {
      return res.status(400).json({ message: "No fan speed number provided." });
    }

    if (Number.isNaN(speedInt) || speedInt < 0 || speedInt > 100) {
      return res.status(400).json({ message: "Invalid fan speed number." });
    }

    this.mqttService.sendMessage(this.name, speed);
    res.json({
      message: `Fan has been adjusted at speed ${speed} successfully.`,
    });
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

    const query = FanRecordModel.find(
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

export default new FanController();
