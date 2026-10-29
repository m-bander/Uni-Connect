import { useAuth } from "@/providers/context/authContext";
import type { serverRolesType } from "@/types/api/auth";

export const useGetRoleUrl = () => {
  const { auth } = useAuth();

  const STUDENT_ROLES: serverRolesType[] = [
    "class_representative",
    "course_head",
    "student",
  ];

  const getRoleUrl = () => {
    if (!auth.user) return "";

    if (STUDENT_ROLES.includes(auth.user.role)) return "student";
    if (auth.user.role === "professor/ta") return "instructor";
    if (auth.user.role === "system_admin") return "admin";

    return "";
  };

  return { getRoleUrl };
};
