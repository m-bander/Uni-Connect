import { RequestHandler } from "express";
import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";
import { FileTable } from "../drizzle";
import { uploadThingApi } from "../config/uploadthing";

export const deleteFile: RequestHandler = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const file = await db.query.FileTable.findFirst({
      where: eq(FileTable.id, fileId),
    });

    if (!file) return res.status(400).json({ message: "File not found." });

    const deletedUploadedFile = await uploadThingApi.deleteFiles([file.key]);

    if (!deletedUploadedFile.deletedCount)
      return res.status(500).json({ message: "File couldn't be deleted." });

    await db.delete(FileTable).where(eq(FileTable.id, fileId));

    return res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
};
