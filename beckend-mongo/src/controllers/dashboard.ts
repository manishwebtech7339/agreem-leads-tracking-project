import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import { Lead, User } from "../db/schema.js";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [totalLeads, newLeads, convertedLeads, totalUsers] =
      await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: "new" }),
        Lead.countDocuments({ status: { $in: ["qualified", "converted"] } }),
        User.countDocuments(),
      ]);

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalLeads,
        newLeads,
        convertedLeads,
        totalUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};
