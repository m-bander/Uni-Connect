type File = {
  id: string;
  name: string;
  type: FileType;
  size: string;
  key: string;
  url: string;
  uploaded_at: number;
};

export type FileType = "application/pdf"; // more could be added later

export { type File };
