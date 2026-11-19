import { Request, Response, NextFunction } from "express";
import {
  TryCatch,
  Success,
  generateOtp,
  sendOtp,
  otpValidFor,
} from "../utils/helper";
import User from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
// import { userStatus } from "../utils/enum/enum";
import {
  ForgotPasswordRequest,
  LoginRequest,
  OTPRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOTPRequest,
} from "../types/API/user";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JwtPayloadWithId extends JwtPayload {
  id: string;
}

// Register user API
const register = TryCatch(
  async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler("User alredy exisest", 400));
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    // Send OTP
    const OTP = generateOtp();
    const hashOTP = await bcrypt.hash(OTP, 10);

    const subject = "OTP for email varification";
    const text = `Hi ${newUser.name},\n\nTo verify your email address, please use the following OTP: ${OTP}\n\nIf you did not request this verification, please ignore this email.`;
    const html = `<div style="margin: 30px; padding: 30px; border: 1px solid black; border-radius: 20px 10px;">
         <h4><strong>Hi ${newUser.name},</strong></h4>
         <p>To verify your email address, please use the following OTP: <strong>${OTP}</strong></p>
         <p>If you did not request this verification, please ignore this email.</p>
         <p>Thanks,</p>
     </div>`;

    await sendOtp(newUser.email, subject, text, html);

    newUser.otp = hashOTP;
    newUser.otpExpiry = otpValidFor(10);
    await newUser.save();

    if (!newUser) {
      return next(new ErrorHandler("User is not crated!", 400));
    }

    Success(res, 200, "User is created sucessfully", { userID: newUser._id });
  },
);

// API for user login
const login = TryCatch(
  async (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    const isMatchedPassword = await user.comparePassword(password);
    if (!isMatchedPassword) {
      return next(new ErrorHandler("Password is not correct", 400));
    }

    if (!user.isVerified) {
      // verify first generate the OTP
      const OTP = generateOtp();
      const hashOTP = await bcrypt.hash(OTP, 10);

      const subject = "OTP for email varification";
      const text = `Hi ${user.name},\n\nTo verify your email address, please use the following OTP: ${OTP}\n\nIf you did not request this verification, please ignore this email.`;
      const html = `<div style="margin: 30px; padding: 30px; border: 1px solid black; border-radius: 20px 10px;">
         <h4><strong>Hi ${user.name},</strong></h4>
         <p>To verify your email address, please use the following OTP: <strong>${OTP}</strong></p>
         <p>If you did not request this verification, please ignore this email.</p>
         <p>Thanks,</p>
     </div>`;

      await sendOtp(user.email, subject, text, html);

      user.otp = hashOTP;
      user.otpExpiry = otpValidFor(10);
      await user.save();

      return Success(
        res,
        200,
        "You are not verified!, verify first. The OTP sent to your email succesfully",
        {
          userID: user._id,
        },
      );
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      return next(new ErrorHandler("JWT_SECRET is not defined", 500));
    }

    const token: string = jwt.sign(
      { id: user._id.toString(), role: user.role },
      secret as string,
      {
        expiresIn: "3h",
      },
    );

    Success(
      res,
      200,
      `OTP verification is done sucessfully, Welcome ${user.name}!`,
      token,
    );
  },
);

// Send OTP for user verification API
const sendOTP = TryCatch(
  async (
    req: Request<{}, {}, OTPRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorHandler("User is not found!, Please register first", 404),
      );
    }

    const OTP = generateOtp();
    const hashOTP = await bcrypt.hash(OTP, 10);

    const subject = "OTP for email varification";
    const text = `Hi ${user.name},\n\nTo verify your email address, please use the following OTP: ${OTP}\n\nIf you did not request this verification, please ignore this email.`;
    const html = `<div style="margin: 30px; padding: 30px; border: 1px solid black; border-radius: 20px 10px;">
         <h4><strong>Hi ${user.name},</strong></h4>
         <p>To verify your email address, please use the following OTP: <strong>${OTP}</strong></p>
         <p>If you did not request this verification, please ignore this email.</p>
         <p>Thanks,</p>
     </div>`;

    await sendOtp(user.email, subject, text, html);

    user.otp = hashOTP;
    user.otpExpiry = otpValidFor(10);
    await user.save();

    Success(res, 200, "OTP sent to your email succesfully", {
      userID: user._id,
    });
  },
);

// API for OTP verificatuon
const verifyOTP = TryCatch(
  async (
    req: Request<{}, {}, VerifyOTPRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { otp, userID } = req.body;

    const user = await User.findById(userID);
    if (!user) return next(new ErrorHandler("User not fount!", 404));

    if (user?.otpExpiry && user.otpExpiry.getTime() < Date.now()) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return next(new ErrorHandler("OTP expires", 401));
    }

    const isMatched = await user.isMatchedOtp(otp);
    if (!isMatched) {
      return next(new ErrorHandler("OTP is incorrect", 400));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new ErrorHandler("JWT_SECRET is not defined", 500));
    }

    const token: string = jwt.sign(
      { id: user._id.toString(), role: user.role },
      secret as string,
      {
        expiresIn: "3h",
      },
    );

    Success(
      res,
      200,
      `OTP verification is done sucessfully, Welcome ${user.name}!`,
      token,
    );
  },
);

const frogotPassword = TryCatch(
  async (
    req: Request<{}, {}, ForgotPasswordRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Enter the email", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    const secret = process.env.JWT_SECRET + user.id;

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

    const resetURL = `http://localhost:${process.env.PORT}/api/user/resetPassword?token=${token}`;

    const subject = "Password Reset Request";
    const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    const html = `<div style="margin: 30px; padding: 30px; border: 1px solid black; border-radius: 20px 10px;">
         <h4><strong>Hi ${user.name},</strong></h4>
         <p>To reset password, please use the following link: <strong>${resetURL}</strong></p>
         <p>If you did not request this verification, please ignore this email.</p>
         <p>Thanks,</p>
     </div>`;

    await sendOtp(user.email, subject, text, html);

    Success(res, 200, "Link for reset password sented to your mail", {
      resetURL,
    });
  },
);

const resetPassword = TryCatch(
  async (
    req: Request<{}, {}, ResetPasswordRequest, { token: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { token } = req.query;
    const { password } = req.body;

    if (!password) {
      return next(new ErrorHandler("Enter the password!", 400));
    }

    if (!token || typeof token !== "string") {
      return next(new ErrorHandler("Access denied. No token provided.", 401));
    }

    // Decode WITHOUT verifying, only to get userId
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || !decoded.userId) {
      return next(new ErrorHandler("Invalid token!", 401));
    }

    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    // Now construct the same secret used during signing
    const secret = process.env.JWT_SECRET + user.id;

    // Actually verify the token
    jwt.verify(token, secret);

    user.password = password;
    await user.save();

    Success(res, 200, "Password reset successfully", {});
  },
);

export const userController = {
  register,
  login,
  sendOTP,
  verifyOTP,
  frogotPassword,
  resetPassword,
};
