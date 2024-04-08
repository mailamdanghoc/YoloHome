import { Schema, model } from "mongoose";

interface Device {
  name: string;
  threshold: number;
}

interface TemperatureSensor extends Device {}
interface HumiditySensor extends Device {}
interface LightSensor extends Device {}
interface Fan extends Device {}
interface Led extends Device {}

const deviceSchema = new Schema<Device>(
  {
    name: {
      type: String,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
  },
  {
    discriminatorKey: "type",
  }
);

const DeviceModel = model<Device>("Device", deviceSchema);

const TemperatureSensorModel = DeviceModel.discriminator<TemperatureSensor>(
  "TemperatureSensor",
  new Schema<TemperatureSensor>({})
);
const HumiditySensorModel = DeviceModel.discriminator<HumiditySensor>(
  "HumiditySensor",
  new Schema<HumiditySensor>({})
);
const LightSensorModel = DeviceModel.discriminator<LightSensor>(
  "LightSensor",
  new Schema<LightSensor>({})
);
const FanModel = DeviceModel.discriminator<Fan>("Fan", new Schema<Fan>({}));
const LedModel = DeviceModel.discriminator<Led>("Led", new Schema<Led>({}));

export {
  DeviceModel,
  TemperatureSensorModel,
  HumiditySensorModel,
  LightSensorModel,
  FanModel,
  LedModel,
};
