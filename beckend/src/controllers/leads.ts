import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import db from "../db/index.js";
import { eq, like, or } from "drizzle-orm";
import { leads } from "../db/schema.js";
import { leadZodSchemaType } from "../lib/zodSchema.js";

export const leadsGet = async (
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
    const limit = Number(perPage ?? 10);
    const offset = Number(page) * limit;

    // --
    const getLeads = await db.query.leads.findMany({
      where: {
        name: `%${query}%`,
        email: `%${query}%`,
      },
      limit,
      offset,
    });

    // Count
    const totalLeads = await db.$count(
      leads,
      or(like(leads.name, `%${query}%`), like(leads.email, `%${query}%`)),
    );

    return apiResHelper(res, HTTP_STATUS.OK, {
      data: getLeads,
      message: "Leads found successfully",
      page: Number(page ?? "1"),
      perPage: Number(perPage ?? "1"),
      total: totalLeads,
      totalPages: Math.ceil(totalLeads / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const leadGetById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id = "" } = req.params as { id: string };

    // --
    const getLead = await db.query.leads.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!getLead) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        data: null,
        success: false,
        message: "Lead not found",
      });
    }

    return apiResHelper(res, HTTP_STATUS.OK, {
      data: getLead,
      message: "Lead found successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const leadCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, status, phone } = req.body as leadZodSchemaType;
    const { id: userId } = req.user as { id: number };

    // --
    await db.insert(leads).values({
      name,
      email,
      status,
      phone,
      userId: userId,
    });
    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "lead created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const leadUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: leadId } = req.params;
    const { name, email, status, phone } = req.body as leadZodSchemaType;

    // --
    const validateLead = await db.query.leads.findFirst({
      where: {
        id: Number(leadId),
      },
    });
    if (!validateLead) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Lead not found",
      });
    }
    // --
    await db
      .update(leads)
      .set({
        name,
        email,
        status,
        phone,
      })
      .where(eq(leads.id, Number(leadId)));
    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "lead updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const leadDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: leadId } = req.params;

    // --
    const validateLead = await db.query.leads.findFirst({
      where: {
        id: Number(leadId),
      },
    });
    if (!validateLead) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Lead not found",
      });
    }

    // --
    await db.delete(leads).where(eq(leads.id, Number(leadId)));
    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
