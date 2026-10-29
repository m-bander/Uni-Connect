import { useAuth } from "@/providers/context/authContext";
import { Navigate, Outlet, useLocation } from "react-router";
import { Spinner } from "../ui/spinner";
import type { serverRolesType } from "@/types/api/auth";

export const UnAuthGuard = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();
  // TODO: Change calendar to the home page (dashboard)
  let from = location.state?.from?.pathname as string;

  if (loading)
    return (
      <div className="w-dvw h-dvh flex justify-center items-center">
        <Spinner className="size-8" />
      </div>
    );

  const STUDENT_ROLES: serverRolesType[] = [
    "class_representative",
    "student",
    "course_head",
  ];

  function prevRouteFits(from: string, role: serverRolesType) {
    if (STUDENT_ROLES.includes(role)) return from.includes("student");
    if (role === "professor/ta") return from.includes("instructor");
    if (role === "system_admin") return from.includes("system_admin");
    return false;
  }
  const getNavigateRoute = () => {
    if (!auth.user) return "/";

    if (!from || !prevRouteFits(from, auth.user.role)) {
      if (STUDENT_ROLES.includes(auth.user.role)) from = "/student/dashboard";
      else if (auth.user.role === "professor/ta") from = "/instructor/courses";
      else if (auth.user.role === "system_admin") from = "/admin/courses"
      else from = "/";
    }

    return from;
  };

  return !auth.user ? <Outlet /> : <Navigate to={getNavigateRoute()} replace />;
};
