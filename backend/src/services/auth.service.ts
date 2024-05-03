import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  AccountDocument,
  AccountModel,
  AccountStatus,
  AccountType,
} from "../models/account.model";
import { CustomError } from "../utils/error";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  username: string;
}

class AuthService {
  private saltRounds = 10;
  private static instance: AuthService;

  private constructor() {}

  public static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Database
  async create(payload: { username: string; password: string }) {
    const hashedPassword = await this.hashPassword(payload.password);
    const newGoal = new AccountModel({ ...payload, password: hashedPassword });
    return await newGoal.save();
  }

  async findAll() {
    return await AccountModel.find().sort({ _id: -1 }).exec();
  }

  async findByUsername(username: string) {
    const account = await AccountModel.findOne({ username: username }).exec();
    if (!account) {
      throw new CustomError("Account not found", 404);
    }
    return account;
  }

  async findById(accountId: string) {
    const account = await AccountModel.findById(accountId).exec();
    if (!account) {
      throw new CustomError("Account not found", 404);
    }
    return account;
  }

  async updateOne(accountId: string, payload: Partial<AccountDocument>) {
    if (payload.username !== undefined) {
      throw new CustomError("Username cannot be changed", 403);
    }
    if (payload.password !== undefined) {
      payload.password = await this.hashPassword(payload.password);
    }
    if (
      payload.status !== undefined &&
      !Object.values(AccountStatus).includes(payload.status)
    ) {
      throw new CustomError("Status must be ACTIVE or INACTIVE", 400);
    }
    const account = await AccountModel.findByIdAndUpdate(accountId, payload, {
      new: true,
    }).exec();
    if (!account) {
      throw new CustomError("Account not found", 404);
    }
    return account;
  }

  async deleteOne(accountId: string) {
    const account = await AccountModel.findByIdAndDelete(accountId).exec();
    if (!account) {
      throw new CustomError("Account not found", 404);
    }
    return account;
  }

  async findAllEmails() {
    const models = await AccountModel.find().select("email").exec();
    return models.map(model => model.email);
  }

  // Utility methods
  async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async createToken(username: string, password: string) {
    const account = await this.findByUsername(username);
    const checkPassword = await this.checkPassword(password, account.password);
    if (!checkPassword) {
      throw new CustomError("Wrong password", 403);
    }

    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }

  // Middlewares for API
  authenticateMiddleware(req: Request, res: Response, next: NextFunction) {
    const accountId = req.params.accountId;
    let token: string;
    try {
      token = req.headers.authorization.split(" ")[1];
    } catch (error) {
      throw new CustomError("Missing token", 401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return next(new CustomError("Token is invalid or has expired", 401));
      }
      const username = (decoded as TokenPayload).username;

      this.findByUsername(username)
        .then(account => {
          if (
            account.type === AccountType.ADMIN ||
            (accountId && accountId === account.id)
          ) {
            req.account = account;
            next();
          } else {
            next(new CustomError("Forbidden", 403));
          }
        })
        .catch(next);
    });
  }

  authorizeMiddleware(req: Request, res: Response, next: NextFunction) {
    const username: string = req.account.username;
    if (!username) {
      throw new CustomError("Unauthenticated user", 401);
    }

    AccountModel.findOne({ username: username }).then(doc => {
      if (!doc) {
        return next(new CustomError("Account not found", 404));
      }
      if (doc.type !== AccountType.ADMIN) {
        return next(new CustomError("Account is not an admin", 403));
      }
      next();
    });
  }
}

export default AuthService;
