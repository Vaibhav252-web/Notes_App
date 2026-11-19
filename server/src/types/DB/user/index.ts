import { Document } from "mongoose";
import { userStatus } from "../../../utils/enum/enum";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: userStatus;
  isDeleted: boolean;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  isMatchedOtp(userOtp: string): Promise<boolean>;
  comparePassword(userPassword: string): Promise<boolean>;
}
