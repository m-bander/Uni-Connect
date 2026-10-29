import z, { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { RequestHandler } from "express";
import { APIRequest, RefreshTokenPayload } from "../types/api";
import {
  IUsersSelect,
  RefreshTokensTable,
  usersSelectSchema,
  UsersTable,
} from "../drizzle/schemas/user";
import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";
import "dotenv/config";
import { signAccessToken, signRefreshToken } from "../utils/signTokens";
import {
  clearRefreshTokenCookie,
  createRefreshTokenCookie,
} from "../utils/cookieTokenHandling";
import { changePasswordSchema } from "../validations/auth";

export const login: RequestHandler = async (
  req: APIRequest<IUsersSelect>,
  res
) => {
  try {
    // TODO: On login we can delete all expired refreshTokens in the database
    const userData = usersSelectSchema
      .required({ email: true, password: true })
      .parse(req.body);

    const user = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.email, userData.email),
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "No user exists with the provided email" });

    if (!user.isApproved)
      return res.status(401).json({
        message: "Your account hasn't been approved by the admin yet.",
      });

    const passwordMatch = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid password" });

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      year: user.year,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await db.insert(RefreshTokensTable).values({
      userId: user.id,
      token: refreshToken,
    });

    createRefreshTokenCookie(res, refreshToken);
    const { password, isApproved, ...authUser } = user;
    res.status(200).json({
      accessToken,
      user: authUser,
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ message: "Invalid login data" });

    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const handleRefreshToken: RequestHandler = async (
  req: APIRequest<unknown>,
  res
) => {
  if (!req.cookies?.jwt) return res.sendStatus(400);

  try {
    const refreshToken = req.cookies.jwt;

    const session = await db.query.RefreshTokensTable.findFirst({
      with: {
        user: true,
      },
      where: eq(RefreshTokensTable.token, refreshToken),
    });

    // The database should enforce that the userId column will never be null
    // Therefore this condition shouldn't normally run
    if (session && !session?.user)
      throw new Error("A refresh token must be linked to a user");

    if (!session)
      return res
        .status(401)
        .json({ message: "No session exists with this token." });

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshTokenPayload;

    clearRefreshTokenCookie(res);

    await db
      .delete(RefreshTokensTable)
      .where(eq(RefreshTokensTable.token, refreshToken));

    if (decoded.userId !== session.user.id)
      return res.status(401).json({ message: "Invalid token payload." });

    const newRefreshToken = signRefreshToken({
      userId: session.user.id,
      email: session.user.email,
    });

    const accessToken = signAccessToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      year: session.user.year,
    });

    await db.insert(RefreshTokensTable).values({
      userId: decoded.userId,
      token: newRefreshToken,
    });
    createRefreshTokenCookie(res, newRefreshToken);

    const { password, isApproved, ...user } = session.user;

    res.status(201).json({
      accessToken,
      user,
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      const refreshToken = req.cookies.jwt;
      await db
        .delete(RefreshTokensTable)
        .where(eq(RefreshTokensTable.token, refreshToken));
      clearRefreshTokenCookie(res);
      res.status(401).json({ message: "refresh token is no longer valid." });
    }

    res.status(500).json({ message: "Unexpected server error." });
  }
};

export const logout: RequestHandler = async (req: APIRequest<unknown>, res) => {
  if (!req.cookies?.jwt)
    return res
      .status(200)
      .json({ message: "No cookie provided. Already logged out." });

  try {
    const refreshToken = req.cookies.jwt;

    const session = await db.query.RefreshTokensTable.findFirst({
      with: {
        user: true,
      },
      where: eq(RefreshTokensTable.token, refreshToken),
    });
    clearRefreshTokenCookie(res);

    if (!session || !session?.user) {
      return res
        .status(200)
        .json({ message: "No session exists with this token." });
    }

    await db
      .delete(RefreshTokensTable)
      .where(eq(RefreshTokensTable.token, refreshToken));
    res.status(200).json({ message: "successfully logged out." });
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error." });
  }
};

export const changePassword: RequestHandler = async (req: APIRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const changePassBody = changePasswordSchema.parse(req.body);

    const user = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, req.user.userId),
    });

    if (!user)
      return res
        .status(401)
        .json({ message: "auth user doesn't exist on database" });

    const passwordMatch = await bcrypt.compare(
      changePassBody.oldPassword,
      user.password
    );

    if (!passwordMatch)
      return res.status(401).json({ message: "Incorrect old password" });

    const hashedPassword = await bcrypt.hash(changePassBody.newPassword, 10);

    await db
      .update(UsersTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(UsersTable.id, user.id));

    res.status(200).json({ message: "Successfully changed password" });
  } catch (err) {
    if (err instanceof ZodError)
      return res
        .status(400)
        .json({ message: "Invalid data for change password" });

    res.status(500).json({ message: "Unexpected server error" });
  }
};
