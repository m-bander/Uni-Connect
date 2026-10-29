import type { User } from "../user/user";
export type serverRolesType =
  | "student"
  | "professor/ta"
  | "system_admin"
  | "class_representative"
  | "course_head";

export type loginRequestBody = {
  email: string;
  password: string;
};

export type loginResponse = {
  accessToken: string;
  user: User;
};

export type refreshResponse = loginResponse;
