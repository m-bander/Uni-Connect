import { RequestHandler } from "express";
import { APIRequest } from "../types/api";
import { ZodError } from "zod";
import { db } from "../drizzle/db";
import {
  CoursesTable,
  FileTable,
  materialCreateSchema,
  MaterialTable,
} from "../drizzle";
import { desc, eq } from "drizzle-orm";
import { uploadThingApi } from "../config/uploadthing";

export const getAllMaterials: RequestHandler = async (req, res) => {
  try {
    const courseCode = req.params.courseCode;

    const materials = await db.query.MaterialTable.findMany({
      with: {
        file: true,
        uploader: true,
      },
      where: eq(MaterialTable.course_code, courseCode),
      orderBy: desc(MaterialTable.uploaded_at),
    });

    res.status(200).json(materials);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getMaterial: RequestHandler = async (req, res) => {
  try {
    const materialId = req.params.id;
    const material = await db.query.MaterialTable.findFirst({
      with: {
        file: true,
        uploader: true,
      },
      where: eq(MaterialTable.id, materialId),
    });

    if (!material)
      return res.status(400).json({ message: "Material doesn't exist." });

    res.status(200).json(material);
  } catch (err) {
    res.status(500).json({ message: " Unexpected server error" });
  }
};

export const deleteMaterial: RequestHandler = async (req, res) => {
  try {
    const materialId = req.params.id;

    const material = await db.query.MaterialTable.findFirst({
      with: {
        file: true,
      },
      where: eq(MaterialTable.id, materialId),
    });

    if (!material)
      return res.status(400).json({ message: "Material does not exist" });

    // delete files on uploadthing server
    const data = await uploadThingApi.deleteFiles([material.file.key]);

    if (!data.deletedCount)
      return res
        .status(500)
        .json({ message: "Couldn't delete material files!" });

    await db.delete(MaterialTable).where(eq(MaterialTable.id, materialId));
    await db.delete(FileTable).where(eq(FileTable.id, material.file.id));

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: " Unexpected server error" });
  }
};

export const createMaterial: RequestHandler = async (req: APIRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized." });

    const materialData = materialCreateSchema
      .omit({ uploaded_at: true, uploader_id: true, id: true })
      .parse(req.body);

    await db.insert(MaterialTable).values({
      ...materialData,
      uploader_id: req.user.userId,
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ message: "Invalid material data." });
    }
    res.status(500).json({ message: "Unexpected server error." });
  }
};
export const updateMaterial: RequestHandler = async (req: APIRequest, res) => {
  try {
    const materialId = req.params.id;

    const materialData = materialCreateSchema
      .omit({
        uploaded_at: true,
        uploader_id: true,
        id: true,
        file_id: true,
        course_code: true,
      })
      .parse(req.body);

    await db
      .update(MaterialTable)
      .set(materialData)
      .where(eq(MaterialTable.id, materialId));

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ message: "Invalid material data." });
    }
    res.status(500).json({ message: "Unexpected server error." });
  }
};
