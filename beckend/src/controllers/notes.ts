import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import db from "../db/index.js";
import { notes } from "../db/schema.js";
import { eq, like, or } from "drizzle-orm";
import { leadNoteZodSchemaType } from "../lib/zodSchema.js";

export const notesGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { leadId } = req.params as { leadId: string };
    const { page = "1", perPage = "10" } = req.query as {
      page: string;
      perPage: string;
    };
    const limit = Number(perPage ?? 10);
    const offset = Number(page) * limit;

    // --
    const data = await db.query.notes.findMany({
      where: {
        leadId: Number(leadId),
      },
      limit,
      offset,
    });

    // Count
    const totalLeads = await db.$count(notes);

    return apiResHelper(res, HTTP_STATUS.OK, {
      data: data,
      message: "Lead Notes found successfully",
      page: Number(page ?? "1"),
      perPage: Number(perPage ?? "1"),
      total: totalLeads,
      totalPages: Math.ceil(totalLeads / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const noteGetById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id = "" } = req.params as { id: string };

    // --
    const data = await db.query.notes.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!data) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        data: null,
        success: false,
        message: "Note not found",
      });
    }

    return apiResHelper(res, HTTP_STATUS.OK, {
      data: data,
      message: "Note found successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const noteCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { leadId, content } = req.body as leadNoteZodSchemaType;
    const { id: userId } = req.user as { id: number };

    // --
    await db.insert(notes).values({
      content,
      leadId: Number(leadId),
      userId: Number(userId),
    });
    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "note created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const noteUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: noteId } = req.params;
    const { content } = req.body as leadNoteZodSchemaType;

    // --
    const validateNote = await db.query.notes.findFirst({
      where: {
        id: Number(noteId),
      },
    });
    if (!validateNote) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Note not found",
      });
    }
    // --
    await db
      .update(notes)
      .set({
        content,
      })
      .where(eq(notes.id, Number(noteId)));
    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "note updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const noteDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: noteId } = req.params;

    // --
    const validateLead = await db.query.notes.findFirst({
      where: {
        id: Number(noteId),
      },
    });
    if (!validateLead) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Note not found",
      });
    }

    // --
    await db.delete(notes).where(eq(notes.id, Number(noteId)));
    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
