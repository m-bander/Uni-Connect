import type { User } from "@/types/user/user";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type AuthType = {
  user: User | null;
  token: string | null;
};

type AuthContextType = {
  auth: AuthType;
  setAuth: Dispatch<SetStateAction<AuthType>>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth must be used inside an AuthProvider");

  return authContext;
};
