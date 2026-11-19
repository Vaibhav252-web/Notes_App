import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import nodemailer  from "nodemailer";
import otpGenerator from 'otp-generator'

export const ConnectDB = () => {
  return mongoose.connect(process.env.MONGO_URI as string);
};

export const TryCatch = <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => Promise<unknown>,
) => {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const Success = (
  res: Response,
  status: number,
  message: string,
  data: object | string,
): void => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

// Generate OTP expiry timestamp
export const otpValidFor = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

// Generate 4-digit numeric OTP
export const generateOtp = () => {
  return otpGenerator
    .generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    .toString();
};

// Send OTP email
export const sendOtp = async (
  receiverMail: string,
  subject: string,
  text: string,
  body: string,
) => {
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: receiverMail,
    subject,
    text,
    html: body,
  };

  return transport.sendMail(mailOptions);
};
