import { ControlType, LedRecordModel } from "./models/record.model";

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export async function create() {
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
