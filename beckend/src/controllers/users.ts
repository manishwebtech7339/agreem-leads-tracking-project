import { NextFunction, Request, Response } from "express";
import { apiResHelper, HTTP_STATUS } from "../lib/constants.js";
import db from "../db/index.js";
import { eq, like, or } from "drizzle-orm";
import { users } from "../db/schema.js";

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
    const limit = Number(perPage ?? 10);
    const offset = (Number(page) - 1) * limit;

    const whereClause = query
      ? or(like(users.name, `%${query}%`), like(users.email, `%${query}%`))
      : undefined;

    const data = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        gender: users.gender,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const totalUsers = query
      ? await db.$count(
          users,
          or(like(users.name, `%${query}%`), like(users.email, `%${query}%`)),
        )
      : await db.$count(users);

    return apiResHelper(res, HTTP_STATUS.OK, {
      data,
      message: "Users found successfully",
      page: Number(page ?? "1"),
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

    const [getUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        gender: users.gender,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1);

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
    const user = req.user as { id?: number | string } | undefined;
    const userId = user?.id;

    if (Number(userId) === Number(id)) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Can't delete current session account",
      });
    }

    const validateUser = await db.query.users.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!validateUser) {
      return apiResHelper(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "User not found",
      });
    }

    await db.delete(users).where(eq(users.id, Number(id)));
    return apiResHelper(res, HTTP_STATUS.OK, {
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const currentUserGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as { id?: number | string } | undefined;
    const userId = user?.id;

    if (!userId) {
      return apiResHelper(res, HTTP_STATUS.UNAUTHORIZED, {
        success: false,
        message: "Unauthorized",
      });
    }

    const [getUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        gender: users.gender,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (!getUser) {
      return apiResHelper(res, HTTP_STATUS.NOT_FOUND, {
        data: null,
        success: false,
        message: "User not found",
      });
    }

    return apiResHelper(res, HTTP_STATUS.OK, {
      data: getUser,
      message: "Current user found successfully",
    });
  } catch (error) {
    next(error);
  }
};
