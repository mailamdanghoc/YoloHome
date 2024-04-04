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

const DeviceModel = model("Device", deviceSchema);

const TemperatureSensorModel = DeviceModel.discriminator(
  "TemperatureSensor",
  new Schema<TemperatureSensor>({})
);
const HumiditySensorModel = DeviceModel.discriminator(
  "HumiditySensor",
  new Schema<HumiditySensor>({})
);
const LightSensorModel = DeviceModel.discriminator(
  "LightSensor",
  new Schema<LightSensor>({})
);
const FanModel = DeviceModel.discriminator("Fan", new Schema<Fan>({}));
const LedModel = DeviceModel.discriminator("Led", new Schema<Led>({}));

export {
  DeviceModel,
  TemperatureSensorModel,
  HumiditySensorModel,
  LightSensorModel,
  FanModel,
  LedModel,
};
