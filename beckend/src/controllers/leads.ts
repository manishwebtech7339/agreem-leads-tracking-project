import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../lib/constants.js";

export const leadsGet = async (
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
export const leadGetById = async (
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
export const leadCreate = async (
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
export const leadUpdate = async (
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
export const leadDelete = async (
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
