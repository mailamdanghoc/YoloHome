import { Types, Schema, model } from "mongoose";

export enum NotiType {
  LED_USAGE_EXCEED = "LED_USAGE_EXCEED",
  FAN_USAGE_EXCEED = "FAN_USAGE_EXCEED",
  CRITICAL_TEMPERATURE = "CRITICAL_TEMPERATURE",
  CRITICAL_HUMIDITY = "CRITICAL_HUMIDITY",
  CRITICAL_LIGHT = "CRITICAL_LIGHT",
}

interface Notification {
  message: string;
  type: NotiType;
  account: Types.ObjectId;
  device: Types.ObjectId;
}

const notificationSchema = new Schema<Notification>({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  device: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export const NotificationModel = model<Notification>(
  "Notification",
  notificationSchema
);
