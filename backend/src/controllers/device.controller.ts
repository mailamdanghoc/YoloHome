import DeviceService from "../services/device.service";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/error";
import { DeviceDocument } from "../models/device.model";

export class DeviceController {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = DeviceService.getInstance();
  }

  // Handlers for API
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await this.deviceService.create(req.body);
      res.status(201).json(device);
    } catch (error) {
      next(new CustomError("Failed to create device", 500));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let devices: DeviceDocument[];
      if (req.query.type) {
        const type = req.query.type as string;
        devices = await this.deviceService.findAll(type);
      } else {
        devices = await this.deviceService.findAll();
      }
      res.json(devices);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const deviceId = req.params.deviceId;
    try {
      const device = await this.deviceService.findById(deviceId);
      res.json(device);
    } catch (error) {
      next(error);
    }
  }

  async updateOne(req: Request, res: Response, next: NextFunction) {
    const deviceId = req.params.deviceId;
    const payload = req.body;
    try {
      const device = await this.deviceService.updateOne(deviceId, payload);
      res.json(device);
    } catch (error) {
      next(error);
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const deviceId = req.params.deviceId;
    try {
      const device = await this.deviceService.deleteOne(deviceId);
      res.json(device);
    } catch (error) {
      next(error);
    }
  }
}

export default new DeviceController();
