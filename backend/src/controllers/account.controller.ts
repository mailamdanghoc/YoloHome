import AuthService from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/error";

export class AccountController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  // Handlers for API
  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new CustomError("Username or password is missing", 400);
      }
      const account = await this.authService.findByUsername(username);
      const token = await this.authService.createToken(username, password);
      res.json({ account: account, token: token });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const username: string = req.body.username;
    if (!username) {
      return next(new CustomError("Username is required", 400));
    }

    try {
      await this.authService.findByUsername(username);
      return next(new CustomError("Username already existed", 400));
    } catch (error) {
      if (!(error instanceof CustomError) || error.status !== 404) {
        next(error);
      }
    }

    const payload = {
      ...req.body,
      username: username,
      password: "user123",
      adminId: req.account.id,
    };
    const newAccount = await this.authService.create(payload);
    res.status(201).json({ account: newAccount, defaultPassword: payload.password });
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const accounts = await this.authService.findAll();
      res.json(accounts);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const accountId = req.params.accountId;
    try {
      const account = await this.authService.findById(accountId);
      res.json(account);
    } catch (error) {
      next(error);
    }
  }

  async updateOne(req: Request, res: Response, next: NextFunction) {
    const accountId = req.params.accountId;
    const payload = req.body;
    try {
      const account = await this.authService.updateOne(accountId, payload);
      res.json(account);
    } catch (error) {
      next(error);
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const accountId = req.params.accountId;
    try {
      const account = await this.authService.deleteOne(accountId);
      res.json(account);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const accountId = req.params.accountId;
    const { oldPassword, newPassword } = req.body;
    try {
      if (!oldPassword || !newPassword) {
        throw new CustomError("Old or new password is missing", 400);
      }
      const account = await this.authService.findById(accountId);
      const checkPassword = await this.authService.checkPassword(
        oldPassword,
        account.password
      );
      if (!checkPassword) {
        throw new CustomError("Wrong password", 403);
      }
      await this.authService.updateOne(accountId, { password: newPassword });
      res.json({ message: "success" });
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    const accountId = req.params.accountId;
    const { status } = req.body;
    try {
      if (!status) {
        throw new CustomError("Status is missing", 400);
      }
      await this.authService.updateOne(accountId, { status: status });
      res.json({ message: "success" });
    } catch (error) {
      next(error);
    }
  }
}

export default new AccountController();
