import fs from "fs";
import { RequestHandler } from "express";
import { ObjectSchema } from "joi";

interface ValidationSchema {
  body: ObjectSchema;
}

export const validate = (schema: ValidationSchema): RequestHandler => {
  return (req, res, next) => {
    // if (req.file) {
    //   req.body.image = req.file.path;
    // }

    const { error, value } = schema.body.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      //   if (req.file?.path) {
      //     try {
      //       fs.unlinkSync(req.file.path);
      //     } catch (unlinkError) {
      //       console.log("unlinkError", unlinkError);
      //     }
      //   }

      return res.status(400).json({
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    next();
  };
};
