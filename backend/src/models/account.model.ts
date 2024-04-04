import { Types, Schema, model } from "mongoose";

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
  adminID: Types.ObjectId;
}

const accountSchema = new Schema<Account>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  fullname: {
    type: String,
  },
  phone: {
    type: String,
  },
  adminID: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    default: null,
  },
});

export default model("Account", accountSchema);
