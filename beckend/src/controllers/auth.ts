import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import { hashPassword, validatePassword } from "../lib/securePassword.js";
import db from "../db/index.js";
import { users } from "../db/schema.js";
import { createJwtToken, verifyJwtToken } from "../lib/jwtToken.js";
import { JwtPayload } from "jsonwebtoken";
import { eq } from "drizzle-orm";

const STATIC_OTP = "123456";

// Sign Up
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, gender, password } = req.body;

    // Create secure password
    const hashedPassword = await hashPassword(password);
    // Check if user already exists in the database
    const checkUserExists = await db.query.users.findFirst({
      where: {
        email: email,
      },
    });
    if (checkUserExists) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "User already exists",
      });
    }

    // Create a new user in the database
    await db.insert(users).values({
      name,
      email,
      gender,
      password: hashedPassword.password,
      salt: hashedPassword.salt,
    });
    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "User signed up successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Sign In
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists in the database
    const checkUserExists = await db.query.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!checkUserExists) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "Invalid credentials",
      });
    }

    // Validate password
    const isPasswordValid = await validatePassword(
      password,
      checkUserExists.password,
      checkUserExists.salt,
    );

    if (!isPasswordValid) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create auth token
    const token = createJwtToken({
      id: checkUserExists.id,
      email: checkUserExists.email,
    });

    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "User signed in successfully",
      data: {
        user: {
          id: checkUserExists.id,
          name: checkUserExists.name,
          email: checkUserExists.email,
          gender: checkUserExists.gender,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "Email is required",
      });
    }

    const user = await db.query.users.findFirst({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "User not found",
      });
    }

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "OTP generated successfully",
      data: {
        email: user.email,
        otp: STATIC_OTP,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !email.trim() ||
      !otp
    ) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (otp !== STATIC_OTP) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await db.query.users.findFirst({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "User not found",
      });
    }

    // Reset token for password reset
    const resetToken = await createJwtToken({
      id: user.id,
      email: user.email,
      purpose: "password-reset",
    });

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "OTP verified successfully",
      data: { resetToken },
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (
      typeof resetToken !== "string" ||
      !resetToken ||
      typeof newPassword !== "string" ||
      newPassword.length < 8
    ) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message:
          "A reset token and a password of at least 8 characters are required",
      });
    }

    let decoded: JwtPayload;

    try {
      const payload = await verifyJwtToken(resetToken);

      if (typeof payload === "string") {
        throw new Error("Invalid token payload");
      }

      decoded = payload;
    } catch {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    if (
      decoded.purpose !== "password-reset" ||
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string"
    ) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "Invalid reset token",
      });
    }

    const user = await db.query.users.findFirst({
      where: {
        id: decoded.id,
        email: decoded.email,
      },
    });

    if (!user) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword.password,
        salt: hashedPassword.salt,
      })
      .where(eq(users.id, user.id));

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
