import express from "express";
import { userController } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import userSchema from "../schemas/user.schema";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userSchema.registerValidation),
  userController.register,
);

userRouter.post(
  "/login",
  validate(userSchema.LoginValidation),
  userController.login,
);

userRouter.post(
  "/sendOTP",
  validate(userSchema.OTPValidation),
  userController.sendOTP,
);

userRouter.post(
  "/verifyOTP",
  validate(userSchema.VerifyOTPValidaton),
  userController.verifyOTP,
);

userRouter.post("/forgetPassword", userController.frogotPassword);

userRouter.post("/resetPassword", userController.resetPassword);

export default userRouter;
