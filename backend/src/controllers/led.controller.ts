import MQTTService from "../services/mqtt.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { CustomError } from "../utils/error";
import { ADAFRUIT_IO_FEEDS } from "../config/adafruit";
import { NextFunction, Request, Response } from "express";
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

      const query = LedRecordModel.find(
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

export default new LedController();
