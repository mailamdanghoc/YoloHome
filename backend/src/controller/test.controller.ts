import { Request, Response } from "express";
import testModel from "../model/test.model";

class TestController {
  async test(req: Request, res: Response) {
    const data = await testModel.getData();
    res.send(`Testing result: ${data}`);
  }
}

export default new TestController();
