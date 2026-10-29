import type { FileType } from "@/types/student/file";

export const getDisplayFileType = (fileType: FileType) => {
  return fileType.split("/").at(-1)?.toUpperCase();
};
