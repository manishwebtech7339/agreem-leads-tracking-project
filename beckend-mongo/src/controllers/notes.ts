import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import { Note } from "../db/schema.js";
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

    const data = await Note.find({ leadId });

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

    if (!mongoose.isValidObjectId(id)) {
      return apiResHelper(res, HTTP_STATUS.NOT_FOUND, {
        data: null,
        success: false,
        message: "Note not found",
      });
    }

    const data = await Note.findById(id);

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
    const { id: userId } = req.user as { id: string };

    await Note.create({
      content,
      leadId,
      userId,
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

    if (!mongoose.isValidObjectId(noteId)) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Note not found",
      });
    }

    const validateNote = await Note.findById(noteId);
    if (!validateNote) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Note not found",
      });
    }

    await Note.findByIdAndUpdate(noteId, {
      ...(content !== undefined ? { content } : {}),
    });

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

    if (!mongoose.isValidObjectId(noteId)) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Note not found",
      });
    }

    const validateNote = await Note.findById(noteId);
    if (!validateNote) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Note not found",
      });
    }

    await Note.findByIdAndDelete(noteId);

    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
