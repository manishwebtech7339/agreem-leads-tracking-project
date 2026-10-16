import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import db from "../db/index.js";
import { notes } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { leadNoteZodSchemaType } from "../lib/zodSchema.js";

export const notesGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const leadId = req.query.leadId as string | undefined;

    if (!leadId) {
      return apiResHelper(res, HTTP_STATUS.OK, {
        success: false,
        data: [],
        message: "Lead id is required",
      });
    }

    const data = await db
      .select()
      .from(notes)
      .where(leadId ? eq(notes.leadId, Number(leadId)) : undefined);

    return apiResHelper(res, HTTP_STATUS.OK, {
      data,
      message: "Notes found successfully",
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

    const [data] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, Number(id)))
      .limit(1);

    if (!data) {
      return apiResHelper(res, HTTP_STATUS.NOT_FOUND, {
        data: null,
        success: false,
        message: "Note not found",
      });
    }

    return apiResHelper(res, HTTP_STATUS.OK, {
      data,
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

    await db.insert(notes).values({
      content,
      leadId: Number(leadId),
      userId: Number(userId),
    });

    return apiResHelper(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Note created successfully",
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
    const { content } = req.body as Partial<leadNoteZodSchemaType>;

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

    await db
      .update(notes)
      .set({
        ...(content !== undefined ? { content } : {}),
      })
      .where(eq(notes.id, Number(noteId)));

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "Note updated successfully",
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

    await db.delete(notes).where(eq(notes.id, Number(noteId)));
    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
