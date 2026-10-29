import { useAuth } from "@/providers/context/authContext";
import type { serverRolesType } from "@/types/api/auth";

export const useHasRole = () => {
  const { auth } = useAuth();

  const hasRole = (...allowedRoles: serverRolesType[]) => {
    return auth.user && allowedRoles.includes(auth.user.role);
  };

  return { hasRole };
};
