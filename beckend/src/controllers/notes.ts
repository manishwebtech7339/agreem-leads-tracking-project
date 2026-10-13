import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../lib/constants.js";

export const notesGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User signed up successfully" });
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
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User signed up successfully" });
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
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User signed up successfully" });
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
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User signed up successfully" });
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
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User signed up successfully" });
  } catch (error) {
    next(error);
  }
};
