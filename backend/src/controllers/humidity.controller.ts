import MQTTService from "../services/mqtt.service";
import MailService, { MailType } from "../services/mail.service";
import AuthService from "../services/auth.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { ADAFRUIT_IO_FEEDS } from "../config/adafruit";
import { Request, Response } from "express";
import { HumidityRecordModel } from "../models/record.model";
import { DeviceModel } from "../models/device.model";
import { PipelineStage } from "mongoose";
import { Server } from "socket.io";
import SocketIOService from "../services/socketio.service";

export class HumidityController implements Subscriber {
  readonly name = ADAFRUIT_IO_FEEDS + "humidity";
  private mqttService: MQTTService;
  private mailService: MailService;
  private io: Server;
  private willSendEmail: boolean;

  constructor() {
    this.mqttService = MQTTService.getInstance();
    this.mqttService.subscribe(this);
    this.mqttService.addTopic(this.name);
    this.mailService = MailService.getInstance();
    this.io = SocketIOService.getIO();
    this.willSendEmail = true;
  }

  // Interface method
  async update(context: IContext) {
    this.io.emit("humidity", context.payload);

    // Notify if exceed threshold
    const device = await DeviceModel.findOne({ type: "HumiditySensor" }).exec();
    if (this.willSendEmail && Number(context.payload) > device.threshold) {
      const emails: string[] = await AuthService.getInstance().findAllEmails();
      this.mailService.sendEmail(emails, MailType.THRESHOLD_HUMIDITY);
      this.willSendEmail = false;
      setTimeout(
        () => {
          this.willSendEmail = true;
        },
        1000 * 60 * 60
      ); // 1h
    }

    await HumidityRecordModel.create({
      humidity: Number(context.payload),
    });
  }

  // Additional methods
  private async getAvgOnInterval(
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
          timestamp: dateOption,
        },
      });
    }

    const format = typ === "day" ? "%Y-%m-%d" : typ === "month" ? "%Y-%m" : "%Y";
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
          avgValue: { $avg: "$humidity" },
        },
      },
      {
        $project: {
          _id: 0,
          time: "$_id",
          avgValue: 1,
        },
      },
      {
        $sort: {
          time: -1,
        },
      }
    );

    return await HumidityRecordModel.aggregate(pipeline).exec();
  }

  // Handlers for API
  async getAvgDataByInterval(req: Request, res: Response) {
    const startDate = req.body.startDate ? new Date(req.body.startDate) : undefined;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : undefined;
    const intervalType = ["day", "month", "year"].includes(req.body.intervalType)
      ? req.body.intervalType
      : "day";

    const data = await this.getAvgOnInterval(startDate, endDate, intervalType);

    res.json({ data: data });
  }
}

export default new HumidityController();
