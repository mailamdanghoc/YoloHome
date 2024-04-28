import MQTTService from "../services/mqtt.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { CustomError } from "../utils/error";
import { ADAFRUIT_IO_FEEDS } from "../config/adafruit";
import { NextFunction, Request, Response } from "express";
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
      throw new CustomError("No fan speed number provided.", 400);
    }

    if (Number.isNaN(speedInt) || speedInt < 0 || speedInt > 100) {
      throw new CustomError("Invalid fan speed number.", 400);
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
    this.speed = speedInt;
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, startDate, endDate } = req.query;

      const dateOption = {};
      if (startDate !== undefined) {
        const d = new Date(startDate.toString());
        if (isNaN(Number(d))) {
          throw new CustomError("Invalid startDate.", 400);
        }
        dateOption["$gte"] = d;
      }
      if (endDate !== undefined) {
        const d = new Date(endDate.toString());
        if (isNaN(Number(d))) {
          throw new CustomError("Invalid endDate.", 400);
        }
        dateOption["$lte"] = d;
      }

      const query = FanRecordModel.find(
        startDate === undefined && endDate === undefined
          ? {}
          : { timestamp: dateOption }
      ).sort({
        timestamp: -1,
      });

      if (limit !== undefined) {
        const limitInt = Number(limit.toString());
        if (!Number.isInteger(limitInt)) {
          throw new CustomError("Limit must be an integer.", 400);
        }
        query.limit(limitInt);
      }

      const data = await query.exec();
      res.json({ data: data });
    } catch (err) {
      next(err);
    }
  }

  async findNewest(req: Request, res: Response) {
    res.json({ data: await this.getNewestDataPoint() });
  }

  async getUsedTimeByInterval(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, intervalType } = req.query;

      let d1: Date | undefined = undefined;
      let d2: Date | undefined = undefined;
      let type: "day" | "month" | "year";

      if (startDate !== undefined) {
        const d = new Date(startDate.toString());
        if (isNaN(Number(d))) {
          throw new CustomError("Invalid startDate.", 400);
        }
        d1 = d;
      }
      if (endDate !== undefined) {
        const d = new Date(endDate.toString());
        if (isNaN(Number(d))) {
          throw new CustomError("Invalid endDate.", 400);
        }
        d2 = d;
      }
      if (intervalType !== undefined) {
        const tmp = intervalType.toString();
        switch (tmp) {
          case "day":
          case "month":
          case "year":
            type = tmp;
            break;
          default:
            throw new CustomError("Invalid intervalType.", 400);
        }
      }

      const data = await this.getSumOnInterval(d1, d2, type);
      res.json({ data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default new FanController();
