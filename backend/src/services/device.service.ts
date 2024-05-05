import { DeviceModel, DeviceDocument } from "../models/device.model";
import CustomError from "../utils/error";

class DeviceService {
  private static instance: DeviceService;

  private constructor() {}

  public static getInstance() {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  // Database
  async create(payload: Partial<DeviceDocument>): Promise<DeviceDocument> {
    return await DeviceModel.create(payload);
  }

  async findAll(type?: string): Promise<DeviceDocument[]> {
    if (type) {
      return await DeviceModel.find({ type: type }).exec();
    }
    return await DeviceModel.find().exec();
  }

  async findByType(type: string): Promise<DeviceDocument> {
    const device = await DeviceModel.findOne({ type: type }).exec();
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    return device;
  }

  async findById(deviceId: string): Promise<DeviceDocument> {
    const device = await DeviceModel.findById(deviceId).exec();
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    return device;
  }

  async updateOne(
    deviceId: string,
    payload: Partial<DeviceDocument>
  ): Promise<DeviceDocument> {
    const device = await DeviceModel.findByIdAndUpdate(deviceId, payload, {
      new: true,
    }).exec();
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    return device;
  }

  async deleteOne(deviceId: string): Promise<DeviceDocument> {
    const device = await DeviceModel.findByIdAndDelete(deviceId).exec();
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    return device;
  }
}

export default DeviceService;
