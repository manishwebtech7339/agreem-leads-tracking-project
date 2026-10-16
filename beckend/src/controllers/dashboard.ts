import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import db from "../db/index.js";
import { eq, or } from "drizzle-orm";
import { leads, users } from "../db/schema.js";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [totalLeads, newLeads, convertedLeads, totalUsers] =
      await Promise.all([
        db.$count(leads),
        db.$count(leads, eq(leads.status, "new")),
        db.$count(
          leads,
          or(eq(leads.status, "qualified"), eq(leads.status, "converted")),
        ),
        db.$count(users),
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
