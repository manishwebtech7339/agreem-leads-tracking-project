import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import { Lead, Note } from "../db/schema.js";
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

    const data = await Lead.find(filter).skip(offset).limit(limit);
    const totalLeads = await Lead.countDocuments(filter);

    return apiResHelper(res, HTTP_STATUS.OK, {
      data,
      message: "Leads found successfully",
      page: pageNumber,
      perPage: limit,
      total: totalLeads,
      totalPages: Math.ceil(totalLeads / limit) || 1,
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

    if (!mongoose.isValidObjectId(id)) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        data: null,
        success: false,
        message: "Lead not found",
      });
    }

    const getLead = await Lead.findById(id);

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
    const { id: userId } = req.user as { id: string };

    // --
    const validateLead = await Lead.findOne({ email });
    if (validateLead) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Lead already created for this email",
      });
    }

    // --
    await Lead.create({
      name,
      email,
      status,
      phone,
      userId,
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
    const { name, email, status, phone } =
      req.body as Partial<leadZodSchemaType>;

    if (!mongoose.isValidObjectId(leadId)) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Lead not found",
      });
    }

    const validateLead = await Lead.findById(leadId);
    if (!validateLead) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Lead not found",
      });
    }

    await Lead.findByIdAndUpdate(leadId, {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(phone !== undefined ? { phone } : {}),
    });

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "Lead updated successfully",
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

    if (!mongoose.isValidObjectId(leadId)) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Lead not found",
      });
    }

    const validateLead = await Lead.findById(leadId);
    if (!validateLead) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Lead not found",
      });
    }

    await Lead.findByIdAndDelete(leadId);
    await Note.deleteMany({ leadId });

    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
