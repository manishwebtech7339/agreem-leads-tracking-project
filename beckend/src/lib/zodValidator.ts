import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { apiResHelper, HTTP_STATUS } from "./constants.js";

export const zodValidate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    next();
  };
};
