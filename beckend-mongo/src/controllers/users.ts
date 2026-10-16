import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import { User, Lead, Note } from "../db/schema.js";

export const usersGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      perPage = "10",
      query = "",
    } = req.query as { page: string; perPage: string; query: string };

    const limit = Number(perPage || 10);
    const pageNumber = Number(page || 1);
    const offset = (pageNumber - 1) * limit;

    const filter: any = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    const data = await User.find(filter)
      .select("-password -salt")
      .skip(offset)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);

    return apiResHelper(res, HTTP_STATUS.OK, {
      data,
      message: "Users found successfully",
      page: pageNumber,
      perPage: limit,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit) || 1,
    });
  } catch (error) {
    next(error);
  }
};

export const userGetById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id = "" } = req.params as { id: string };

    if (!mongoose.isValidObjectId(id)) {
      return apiResHelper(res, HTTP_STATUS.NOT_FOUND, {
        data: null,
        success: false,
        message: "User not found",
      });
    }

    const getUser = await User.findById(id).select("-password -salt");

    if (!getUser) {
      return apiResHelper(res, HTTP_STATUS.NOT_FOUND, {
        data: null,
        success: false,
        message: "User not found",
      });
    }

    return apiResHelper(res, HTTP_STATUS.OK, {
      data: getUser,
      message: "User found successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const userDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "User not found",
      });
    }

    const validateUser = await User.findById(id);
    if (!validateUser) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);
    await Lead.deleteMany({ userId: id });
    await Note.deleteMany({ userId: id });

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
