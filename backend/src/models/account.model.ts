import { Types, Schema, model, HydratedDocument } from "mongoose";

export enum AccountType {
  ADMIN = "ADMIN",
  SUB = "SUB",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

interface Account {
  username: string;
  password: string;
  type: AccountType;
  status: AccountStatus;
  email?: string;
  fullname?: string;
  phone?: string;
  adminId: Types.ObjectId;
}

export type AccountDocument = HydratedDocument<Account>;

const accountSchema = new Schema<Account>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: AccountType.SUB,
    },
    status: {
      type: String,
      required: true,
      default: AccountStatus.ACTIVE,
    },
    email: {
      type: String,
      default: "",
    },
    fullname: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

export const AccountModel = model<Account>("Account", accountSchema);
