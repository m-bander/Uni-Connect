import { RequestHandler } from "express";
import { db } from "../drizzle/db";
import { BadRequestError, NotFoundError } from "../utils/errors/errors";
import { message, messageInsertSchema, UsersTable } from "../drizzle";
import z from "zod";
import { getIO } from "../lib/socket";
import { eq } from "drizzle-orm";

export const getMessages: RequestHandler = async (request, response, next) => {
  const groupId = request.params.group_id;

  // TODO: Add an option to fetch last n messages

  try {
    // TODO: Add authentication and authorization
    const group = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.id, groupId),
      with: {
        messages: {
          with: {
            sender: true,
          },
          orderBy: (message, { asc }) => asc(message.created_at),
        },
      },
    });

    if (!group) {
      throw new NotFoundError("Group not found.");
    }

    response.status(200).json({
      message: "Group found, with its messages.",
      // Separate group from messages cleanliness
      data: {
        // Return group data without messages to prevent duplication
        group: Object.fromEntries(
          Object.entries(group).filter(([key]) => key !== "messages")
        ),
        messages: group.messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addMessage: RequestHandler = async (request, response, next) => {
  const groupId = request.params.group_id;

  // Inject group_id in the request body to prevent parsing errors, as we do not want to force API users to put the id in the query params and the body
  // TODO: I think you can don't need to inject group_id
  request.body.group_id = groupId;

  try {
    // TODO: Add authentication and authorization
    const validatedMessage = messageInsertSchema.parse(request.body);
    const [newMessage] = await db
      .insert(message)
      .values(validatedMessage)
      .returning();

    const sender = await db.query.UsersTable.findFirst({
      where: (user, { eq }) => eq(user.id, newMessage.sender_id),
    });

    const responseData = {
      ...newMessage,
      sender,
    };

    // Update websocket
    getIO().emit(`messages-group-${groupId}`, {
      action: "create",
      message: responseData,
    });

    response.status(201).json({
      message: "Message added successfully",
      data: responseData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new BadRequestError("Data is invalid.", error.issues));
    }

    next(error);
  }
};

export const deleteMessage: RequestHandler = async (
  request,
  response,
  next
) => {
  const groupId = request.params.group_id;
  const messageId = request.params.message_id;

  try {
    // TODO: Add authentication and authorization
    const [deletedMessage] = await db
      .delete(message)
      .where(eq(message.id, messageId))
      .returning();

    // Update websocket
    getIO().emit(`messages-group-${groupId}`, {
      action: "delete",
      message: deletedMessage,
    });

    response.status(200).json({
      message: "Message added successfully",
      data: deletedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// This handler allows only changing the content of a message
export const patchMessage: RequestHandler = async (request, response, next) => {
  const groupId = request.params.group_id;
  const messageId = request.params.message_id;

  try {
    // TODO: Add authentication and authorization
    const newContent = request.body.content;

    if (newContent.length === 0) {
      throw new BadRequestError("Message content can't be empty.");
    }

    const [patchedMessage] = await db
      .update(message)
      .set({ content: newContent })
      .where(eq(message.id, messageId))
      .returning();

    const sender = await db.query.UsersTable.findFirst({
      where: (user, { eq }) => eq(user.id, patchedMessage.sender_id),
    });

    const responseData = {
      ...patchedMessage,
      sender,
    };

    // Update websocket
    getIO().emit(`messages-group-${groupId}`, {
      action: "update",
      message: responseData,
    });

    response.status(200).json({
      message: "Message updated successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
