import "dotenv/config";
import jwt from "jsonwebtoken";

export const createJwtToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
};

export const verifyJwtToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
