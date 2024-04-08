import MQTTService from "../services/mqtt.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { ADAFRUIT_IO_FEEDS } from "../config/adafruit";
import { Request, Response } from "express";
import { ControlType, FanRecordModel } from "../models/record.model";
import { PipelineStage } from "mongoose";

export class FanController implements Subscriber {
  readonly name = ADAFRUIT_IO_FEEDS + "fan";
  private mqttService: MQTTService;
  private speed: number;

  constructor() {
    this.mqttService = MQTTService.getInstance();
    this.mqttService.subscribe(this);
    this.mqttService.addTopic(this.name);
    this.getNewestDataPoint().then(data => {
      this.speed = data?.speed || 0;
    });
  }

  // Interface methods
  async update(context: IContext) {
    const newModel = new FanRecordModel({
      speed: parseInt(context.payload),
      controlType: ControlType.MANUAL,
      timestamp: Date.now(),
    });

    newModel.save().then(async data => {
      if (context.payload === "0") {
        const lastTurnOffData = await FanRecordModel.find({ speed: 0 })
          .sort({ timestamp: -1 })
          .limit(2)
          .exec();

        let queryObject: { timestamp?: { $gt: Date } };
        if (lastTurnOffData.length === 2) {
          queryObject = {
            timestamp: { $gt: lastTurnOffData[1].timestamp },
          };
        } else {
          queryObject = {};
        }

        const lastTurnOnData = await FanRecordModel.findOne(queryObject).exec();

        newModel.totalTime =
          (data.timestamp.getTime() - lastTurnOnData.timestamp.getTime()) /
          1000;
        newModel.save();
      }
    });
  }

  // Additional methods
  private async getNewestDataPoint() {
    return await FanRecordModel.findOne().sort({ timestamp: -1 }).exec();
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
            { speed: 0 },
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

    return await FanRecordModel.aggregate(pipeline).exec();
  }

  // Handlers for API
  control(req: Request, res: Response) {
    const speed: string = req.body.speed;
    const speedInt = Number(speed);

    if (typeof speed === "undefined") {
      return res.status(400).json({ message: "No fan speed number provided." });
    }

    if (Number.isNaN(speedInt) || speedInt < 0 || speedInt > 100) {
      return res.status(400).json({ message: "Invalid fan speed number." });
    }

    if (this.speed === speedInt) {
      return res.json({ message: `Fan was already at speed ${speed}.` });
    }

    this.mqttService.sendMessage(this.name, speed);
    res.json({
      message:
        speedInt === 0
          ? "Fan has been turned off successfully."
          : `Fan has been adjusted at speed ${speed} successfully.`,
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

export default new FanController();
