import { userStatus } from "../../../utils/enum/enum";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  // role: userStatus;
};

export type LoginRequest = {
  email: string;
  password: string;
}

export type OTPRequest = {
  email: string;
};

export type VerifyOTPRequest = {
  otp: string;
  userID: string;
};

export type ForgotPasswordRequest = {
  email: string;
}

export type ResetPasswordRequest = {
  password: string;
}
