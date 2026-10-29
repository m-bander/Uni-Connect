import { RequestHandler } from "express";

import { APIRequest, userRolesType } from "../types/api";
import z from "zod";
import bcrypt from "bcrypt";

import { db } from "../drizzle/db";
import {
  IUsersInsert,
  IUsersUpdate,
  usersInsertSchema,
  UsersTable,
  usersUpdateSchema,
} from "../drizzle/schemas/user";
import { and, eq, getTableColumns, not, notInArray, ilike, or } from "drizzle-orm";
import { NotFoundError } from "../utils/errors/errors";
import { CoursesTable, enrolledIn } from "../drizzle";
import { MaterialTable } from "../drizzle/schemas/materials";
import { uploadThingApi, imageStorageKey } from "../config/uploadthing";

export const updateProfile: RequestHandler = async (
  req: APIRequest<IUsersUpdate>,
  res
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // All properties in omit shouldn't be updated via the updateProfile route
    const updatedData = usersUpdateSchema
      .omit({
        code: true,
        id: true,
        year: true,
        password: true,
        role: true,
        isApproved: true,
      })
      .parse(req.body);

    if(updatedData.email) {
      const duplicate = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.email, updatedData.email));

      if (duplicate.some(user=>user.id!==req.user!.userId)) {
        return res
          .status(400)
          .json({ message: `${updatedData.email} is already used.` });
      }
    }

    await db
      .update(UsersTable)
      .set(updatedData)
      .where(eq(UsersTable.id, req.user.userId));

    res.status(200).json({ message: "Successfully updated user data." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid user data update" });
    }
    console.log(err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getCurrentUserData: RequestHandler = async (
  req: APIRequest<unknown>,
  res
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, req.user.userId),
      columns: {
        isApproved: false,
        password: false,
      },
    });

    if (!user) res.status(400).json({ message: "User doesn't exist" });

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid user data update" });
    }
    res.status(500).json({ message: "Unexpected server error" });
  }
};

const ALLOWED_REGISTER_ROLES: userRolesType[] = ["professor/ta", "student"];

export const createUser: RequestHandler = async (
  req: APIRequest<IUsersInsert>,
  res
) => {
  try {
    const userData = usersInsertSchema.parse(req.body);

    const duplicate = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, userData.email));

    if (duplicate.length > 0) {
      return res
        .status(400)
        .json({ message: `${userData.email} is already used.` });
    }

    if (!ALLOWED_REGISTER_ROLES.includes(userData.role))
      return res.status(401).json({
        message: `You can't create a user with role ${userData.role} unless you're authorized.`,
      });

    if (userData.role == "student" && (!userData.year || !userData.code))
      return res.status(400).json({ message: "Student data is not complete." });

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const isApproved = (userData.role === "student") || (req.user?.role === "system_admin");
    console.log(req.user?.role)

    await db
      .insert(UsersTable)
      .values({ ...userData, isApproved, password: hashedPassword });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid User Data" });
    }

    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const createAdmin: RequestHandler = async (request, response, next) => {
  try {
    const userData = usersInsertSchema.parse(request.body);

    const duplicate = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, userData.email));

    if (duplicate.length > 0) {
      return response
        .status(400)
        .json({ message: `${userData.email} is already used.` });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await db.insert(UsersTable).values({
      ...userData,
      password: hashedPassword,
      role: "system_admin",
    });

    response.sendStatus(201);
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return response.status(400).json({ message: "Invalid User Data" });
    }

    response.status(500).json({ message: "Unexpected server error" });
  }
};

const NONE_YEAR_MEMBERS_ROLES: userRolesType[] = [
  "system_admin",
  "professor/ta",
];
export const getYearMembers: RequestHandler = async (
  req: APIRequest<unknown>,
  res
) => {
  try {
    // ? I think for failing students this logic might not be right
    // ? Instead we could get all the courses for a certain year and using enrolled_in get all users associated with these courses
    // ? The resulting users are the members.
    if (!req.user || !req.user.year)
      return res.status(401).json({ message: "Unauthorized" });

    const year = req.user.year;

    const members = await db.query.UsersTable.findMany({
      columns: {
        isApproved: false,
        password: false,
      },
      where: and(
        eq(UsersTable.year, year),
        not(eq(UsersTable.id, req.user.userId)),
        notInArray(UsersTable.role, NONE_YEAR_MEMBERS_ROLES)
      ),
      orderBy: (t, { asc }) => asc(t.first_name),
    });

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getUserData: RequestHandler = async (request, response, next) => {
  const requestUserId = request.params.user_id;
  const dataToBeIncluded = request.query.include;

  // TODO: Apply filtering
  const includeCourses =
    typeof dataToBeIncluded === "string" &&
    dataToBeIncluded.split(",").includes("courses");

  // TODO: Should we have a route for students and a route for instructors?
  // Marwan: I suck at endpoint design

  try {
    const foundUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, requestUserId),
      with: {
        enrolledIn: {
          with: {
            course: {
              with: {
                teachers: {
                  with: {
                    teacher: true,
                  },
                },
              },
            },
          },
        },
        teachingCourses: {
          with: {
            course: {
              with: {
                teachers: {
                  with: {
                    teacher: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!foundUser) throw new NotFoundError("User not found.");

    let resultUserCourses: (typeof CoursesTable.$inferSelect)[] = [];
    if (foundUser.enrolledIn.length > 0) {
      resultUserCourses = foundUser.enrolledIn.map((element) => ({
        ...element.course,
        teachers: element.course.teachers.map((element) => element.teacher),
      }));
    } else if (foundUser.teachingCourses.length > 0) {
      resultUserCourses = foundUser.teachingCourses.map((element) => ({
        ...element.course,
        teachers: element.course.teachers.map((element) => element.teacher),
      }));
    }

    const resultUser = {
      ...foundUser,
      enrolledIn: undefined,
      teachingCourses: undefined,
      courses: resultUserCourses,
    };

    response.status(200).json({
      message: "User found successfully.",
      data: resultUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture: RequestHandler = async (
  req: APIRequest<{ image_url: string }>,
  res
) => {
  try {
    if (!req.user) return res.status(400).json({ message: "Unauthorized" });

    const [userData] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, req.user.userId));

    if (userData.image_url) {
      // delete image first if they exist
      const key = imageStorageKey(userData.image_url);
      await uploadThingApi.deleteFiles([key]);
    }
    await db
      .update(UsersTable)
      .set({
        image_url: req.body.image_url ?? null,
      })
      .where(eq(UsersTable.id, req.user.userId));

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unexpected server error." });
  }
};

// Admin Functions
export const getPaginatedUsers: RequestHandler = async (
  req: APIRequest<unknown>,
  res,
  next
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (req.user.role !== "system_admin")
      return res.status(401).json({ message: "Unauthorized" });

    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string | undefined;
    const role = req.query.role as userRolesType | undefined;
    const yearParam = req.query.year as string | undefined;
    const pendingOnlyParam = req.query.pending_only as string | undefined;
    const pendingOnly = pendingOnlyParam === "true";

    const whereConditions = [];

    // exclude system admins
    whereConditions.push(not(eq(UsersTable.role, "system_admin")));

    // Filter by role
    if (role && role !== "system_admin") {
      whereConditions.push(eq(UsersTable.role, pendingOnly ? "professor/ta" : role));
    }

    // Filter by year
    if (yearParam && ["1", "2", "3", "4", "5"].includes(yearParam)) {
      whereConditions.push(
        eq(UsersTable.year, yearParam as "1" | "2" | "3" | "4" | "5")
      );
    }

    // Filter by pending users flag
    if (pendingOnly) {
      whereConditions.push(eq(UsersTable.isApproved, false));
    }

    // Search by first_name, parent_name, or email
    if (search && search.trim()) {
      const trimmed = search.trim();
      whereConditions.push(
        or(
          ilike(UsersTable.first_name, `%${trimmed}%`),
          ilike(UsersTable.parent_name, `%${trimmed}%`),
          ilike(UsersTable.email, `%${trimmed}%`)
        )
      );
    }

    // where clause
    const whereClause =
      whereConditions.length > 0 ? and(...(whereConditions as any)) : undefined;

    // Get total count for pagination (after applying search & filters)
    const paginatedUsers = await db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(whereClause);
    const total = paginatedUsers.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));

    // Get paginated users
    const offset = (page - 1) * perPage;
    const { password, ...userColumns } = getTableColumns(UsersTable);
    const users = await db
      .select(userColumns)
      .from(UsersTable)
      .where(whereClause)
      .limit(perPage)
      .offset(offset)
      .orderBy(UsersTable.first_name);

    res.status(200).json({
      message: "Users retrieved successfully.",
      data: {
        users,
        total,
        page,
        perPage,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const approveUser: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const requestUserId = request.params.user_id;

  try {
    if (!request.user)
      return response.status(401).json({ message: "Unauthorized" });
    if (request.user.role !== "system_admin")
      return response.status(401).json({ message: "Unauthorized" });

    const foundUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, requestUserId),
    });

    if (!foundUser) throw new NotFoundError("User not found.");

    // set isApproved true
    await db
      .update(UsersTable)
      .set({ isApproved: true })
      .where(eq(UsersTable.id, requestUserId));

    response.status(200).json({
      message: "User approved successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const targetUserId = request.params.user_id;

  try {
    if (!request.user)
      return response.status(401).json({ message: "Unauthorized" });
    if (request.user.role !== "system_admin")
      return response.status(401).json({ message: "Unauthorized" });
    if (!targetUserId)
      return response
        .status(400)
        .json({ message: "Missing user id in route." });

    const foundUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, targetUserId),
    });

    if (!foundUser) throw new NotFoundError("User not found.");

    await db.delete(UsersTable).where(eq(UsersTable.id, targetUserId));

    response.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateUserByAdmin: RequestHandler = async (
  req: APIRequest<IUsersUpdate>,
  res
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "system_admin")
      return res.status(401).json({ message: "Unauthorized" });

    const targetUserId = req.params.user_id;
    const targetUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, targetUserId),
      columns: { email: true },
    });
    
    if (!targetUserId || !targetUser)
      return res.status(400).json({ message: "Missing user id in route." });

    const updatedData = usersUpdateSchema.omit({ id: true }).parse(req.body);
    if(updatedData.password)updatedData.password=await bcrypt.hash(updatedData.password,10);

    if(updatedData.email && updatedData.email != targetUser.email) {
      const duplicate = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.email, updatedData.email),
        columns: { id: true },
      });

      if (duplicate) {
        return res
          .status(400)
          .json({ message: `${updatedData.email} is already used.` });
      }
    }

    await db
      .update(UsersTable)
      .set(updatedData)
      .where(eq(UsersTable.id, targetUserId));

    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid user data update" });
    }
    console.log(err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};
