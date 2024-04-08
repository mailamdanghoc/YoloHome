import MQTTService from "../services/mqtt.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { ADAFRUIT_IO_FEEDS } from "../config/adafruit";
import { Request, Response } from "express";
import { ControlType, LedRecordModel } from "../models/record.model";
import { PipelineStage } from "mongoose";

export class LedController implements Subscriber {
  readonly name = ADAFRUIT_IO_FEEDS + "led";
  private mqttService: MQTTService;
  private state: boolean;

  constructor() {
    this.mqttService = MQTTService.getInstance();
    this.mqttService.subscribe(this);
    this.mqttService.addTopic(this.name);
    this.getNewestDataPoint().then(data => {
      this.state = data?.status || false;
    });
  }

  // Interface methods
  async update(context: IContext) {
    const newModel = new LedRecordModel({
      status: context.payload === "1",
      controlType: ControlType.MANUAL,
      description: `LED was turned ${context.payload === "1" ? "on" : "off"}`,
      timestamp: Date.now(),
    });

    newModel.save().then(async data => {
      if (context.payload === "0") {
        const lastTurnOnData = await LedRecordModel.findOne({ status: 1 })
          .sort({ timestamp: -1 })
          .exec();

        if (!lastTurnOnData) {
          return;
        }

        newModel.totalTime =
          (data.timestamp.getTime() - lastTurnOnData.timestamp.getTime()) /
          1000;
        newModel.save();
      }
    });
  }

  // Additional methods
  private async getNewestDataPoint() {
    return await LedRecordModel.findOne().sort({ timestamp: -1 }).exec();
  }

  private async getSumOnInterval(
    startDate?: Date,
    endDate?: Date,
    typ: "day" | "month" | "year" = "day"
  ) {
    const pipeline: PipelineStage[] = [];

    const dateOption = {};
    if (startDate) {
      dateOption["$gte"] = startDate;
    }
    if (endDate) {
      dateOption["$lte"] = endDate;
    }
    if (startDate || endDate) {
      pipeline.push({
        $match: {
          $and: [
            { timestamp: dateOption },
            { status: false },
            { totalTime: { $exists: true } },
          ],
        },
      });
    }

    const format =
      typ === "day" ? "%Y-%m-%d" : typ === "month" ? "%Y-%m" : "%Y";
    pipeline.push(
      {
        $group: {
          _id: {
            $dateToString: {
              format: format,
              date: "$timestamp",
              timezone: "+07",
            },
          },
          sumValue: { $sum: "$totalTime" },
        },
      },
      {
        $project: {
          _id: 0,
          time: "$_id",
          sumValue: 1,
        },
      },
      {
        $sort: {
          time: -1,
        },
      }
    );

    return await LedRecordModel.aggregate(pipeline).exec();
  }

  // Handlers for API
  async turnon(req: Request, res: Response) {
    if (this.state) {
      return res.json({ message: "LED was already turned on." });
    }

    this.mqttService.sendMessage(this.name, "1");
    res.json({ message: "LED has been turned on successfully." });
    this.state = true;
  }

  async turnoff(req: Request, res: Response) {
    if (!this.state) {
      return res.json({ message: "LED was already turned off." });
    }

    this.mqttService.sendMessage(this.name, "0");
    res.json({ message: "LED has been turned off successfully." });
    this.state = false;
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

  async findNewest(req: Request, res: Response) {
    res.json({ data: await this.getNewestDataPoint() });
  }

  async getUsedTimeByInterval(req: Request, res: Response) {
    const startDate = req.body.startDate
      ? new Date(req.body.startDate)
      : undefined;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : undefined;
    const intervalType = ["day", "month", "year"].includes(
      req.body.intervalType
    )
      ? req.body.intervalType
      : "day";

    const data = await this.getSumOnInterval(startDate, endDate, intervalType);

    res.json({ data: data });
  }
}

export default new LedController();
