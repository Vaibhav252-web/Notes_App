import Joi, { object } from "joi";

const registerValidation = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_. ]+$/)
      .required()
      .messages({
        "string.empty": "Username is required",
        "any.required": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username must not exceed 30 characters",
        "string.pattern.base":
          "Name can only contain letters, numbers, spaces, underscore (_) and dot (.)",
      }),

    email: Joi.string().trim().email().lowercase().required().messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Invalid email format",
    }),
    // role: Joi.string().trim().min(3).max(7).required().messages({
    //   "string.empty": "Role is required",
    //   "any.required": "Role is required",
    //   "string.min": "Role must be at least 3 characters",
    //   "string.max": "Role must not exceed 20 characters",
    // }),

    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.min": "Password must be at least 8 characters",
    }),
  }),
};

const LoginValidation = {
  body: Joi.object({
    email: Joi.string().trim().email().lowercase().required().messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Invalid email format",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.min": "Password must be at least 8 characters",
    }),
  }),
};

const OTPValidation = {
  body: Joi.object({
    email: Joi.string().trim().email().lowercase().required().messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Invalid email format",
    }),
  }),
};

const VerifyOTPValidaton = {
  body: Joi.object({
    otp: Joi.string()
      .length(4)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.empty": "OTP is required",
        "string.length": "OTP must be exactly 4 digits",
        "string.pattern.base": "OTP must contain only numbers",
        "any.required": "OTP is required",
      }),

    userID: Joi.string().required().messages({
      "string.empty": "UserId is required",
      "any.required": "UserId is required",
    }),
  }),
};

export default {
  registerValidation,
  LoginValidation,
  OTPValidation,
  VerifyOTPValidaton,
};
