import mongoose from "mongoose";
import { userStatus } from "../utils/enum/enum";
import { IUser } from "../types/DB/user";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(userStatus),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const HashPassword = await bcrypt.hash(this.password, 10);
  this.password = HashPassword;
});

userSchema.methods.comparePassword = async function (
  userPassword: string,
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.isMatchedOtp = async function (
  userOtp: string,
): Promise<boolean> {
  if (!this.otp) {
    return false;
  }
  return await bcrypt.compare(userOtp, this.otp);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
