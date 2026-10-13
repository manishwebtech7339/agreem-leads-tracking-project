import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import { verifyJwtToken } from "../lib/jwtToken.js";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return apiResHelper(res, HTTP_STATUS.UNAUTHORIZED, {
      success: false,
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return apiResHelper(res, HTTP_STATUS.UNAUTHORIZED, {
      success: false,
      message: "Token missing",
    });
  }

  try {
    const decoded = await verifyJwtToken(token);
    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return apiResHelper(res, HTTP_STATUS.UNAUTHORIZED, {
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authenticate;
