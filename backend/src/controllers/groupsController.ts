import { db } from "../drizzle/db";
import { RequestHandler } from "express";
import { NotFoundError } from "../utils/errors/errors";
import { APIRequest } from "../types/api";

export const getGroup: RequestHandler = async (request, response, next) => {
  const groupId = request.params.group_id;

  try {
    const group = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.id, groupId),
    });

    if (!group) {
      throw new NotFoundError("Group not found.");
    }

    response.status(200).json({
      message: "Group found.",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

export const getGroups: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    if (!request.user) {
      console.log("User not wired to request.");
      throw new Error("Internal server error.");
    }

    const userId = request.user.userId;

    const rows = await db.query.enrolledIn.findMany({
      where: (row, { eq }) => eq(row.userId, userId),
      with: {
        course: {
          with: {
            group: true,
          },
        },
      },
    });

    const teaching=await db.query.Teaches.findMany({where:(row,{eq})=>eq(row.userId,userId),with:{course:{with:{group:true}}}});
    const groups = [...new Map([...rows,...teaching].map(row=>[row.course.group.id,row.course.group])).values()];

    response.status(200).json({
      message: "Groups found.",
      data: groups,
    });
  } catch (error) {
    next(error);
  }
};
