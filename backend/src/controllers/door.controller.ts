import MQTTService from "../services/mqtt.service";
import MailService, { MailType } from "../services/mail.service";
import AuthService from "../services/auth.service";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";
import { ADAFRUIT_IO_FEEDS } from "../config/adafruit";
import { Request, Response } from "express";
import { DoorRecordModel } from "../models/record.model";
import { Server } from "socket.io";
import SocketIOService from "../services/socketio.service";

export class DoorController implements Subscriber {
  readonly name = ADAFRUIT_IO_FEEDS + "door";
  private mqttService: MQTTService;
  private mailService: MailService;
  private io: Server;
  private willSendEmail: boolean;
  private failedAttempts: number;

  constructor() {
    this.mqttService = MQTTService.getInstance();
    this.mqttService.subscribe(this);
    this.mqttService.addTopic(this.name);
    this.mailService = MailService.getInstance();
    this.io = SocketIOService.getIO();
    this.willSendEmail = true;
    this.failedAttempts = 0;
  }

  // Interface method
  async update(context: IContext) {
    this.io.emit("door", context.payload);

    // Notify if exceed threshold
    if (context.payload === "0") {
      this.failedAttempts++;
      if (this.willSendEmail && this.failedAttempts > 3) {
        const emails: string[] = await AuthService.getInstance().findAllEmails();
        this.mailService.sendEmail(emails, MailType.THRESHOLD_DOOR);
        this.willSendEmail = false;
        setTimeout(
          () => {
            this.willSendEmail = true;
          },
          1000 * 60 * 60
        ); // 1h
      }
    } else {
      this.failedAttempts = 0;
    }

    await DoorRecordModel.create({
      status: Boolean(context.payload),
    });
  }

  // Handlers for API
  async getAllDoorStatus(req: Request, res: Response) {
    const door = await DoorRecordModel.find({}).exec();
    res.json(door);
  }
}

export default new DoorController();
