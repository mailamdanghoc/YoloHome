import {
  ControlType,
  FanRecordModel,
  LedRecordModel,
} from "./models/record.model";

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export async function createLed() {
  for (let i = 0; i < 200; i++) {
    const d = randomDate(new Date(2020, 0, 1), new Date());
    const totalTime = (Math.random() + 1) * 10;
    await LedRecordModel.create({
      status: true,
      controlType: ControlType.MANUAL,
      description: `LED was turned on`,
      timestamp: d,
    });
    await LedRecordModel.create({
      status: false,
      controlType: ControlType.MANUAL,
      description: `LED was turned off`,
      timestamp: new Date(d.getTime() + totalTime),
      totalTime: totalTime,
    });
  }
}

export async function createFan() {
  for (let i = 0; i < 100; i++) {
    const d = randomDate(new Date(2022, 0, 1), new Date());
    const d1 = (Math.random() + 1) * 10;
    const d2 = (Math.random() + 1) * 10;
    await FanRecordModel.create({
      speed: Math.floor(Math.random() * 3 + 1) * 25,
      controlType: ControlType.MANUAL,
      timestamp: d,
    });
    await FanRecordModel.create({
      speed: Math.floor(Math.random() * 3 + 1) * 25,
      controlType: ControlType.MANUAL,
      timestamp: new Date(d.getTime() + d1),
    });
    await FanRecordModel.create({
      speed: Math.floor(Math.random() * 3 + 1) * 25,
      controlType: ControlType.MANUAL,
      timestamp: new Date(d.getTime() + d1 + d2),
      totalTime: d1 + d2,
    });
  }
}
