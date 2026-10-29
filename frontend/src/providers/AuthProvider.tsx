import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  type PropsWithChildren,
} from "react";
import { AuthContext, type AuthType } from "./context/authContext";
import api from "@/lib/axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { refreshResponse } from "@/types/api/auth";
import { useActiveTimeOnSite } from "@/hooks/use-active-time-onsite";
import { useQueryClient } from "@tanstack/react-query";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthType>({ user: null, token: null });
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient=useQueryClient();
  const previousUser=useRef<string|null>(null);
  useEffect(()=>{
    const id=auth.user?.id||null;
    if(previousUser.current&&previousUser.current!==id)queryClient.clear();
    previousUser.current=id;
  },[auth.user?.id,queryClient]);

  useActiveTimeOnSite(!!auth.user);

  useEffect(() => {
    // fills in the auth object if a valid refresh cookie is stored
    const controller = new AbortController();
    const signal = controller.signal;
    let mounted = true;

    (async () => {
      try {
        const res = await api.get<refreshResponse>("/api/auth/refresh", {
          signal,
        });
        setAuth({ user: res.data.user, token: res.data.accessToken });
        setLoading(false);
      } catch {
        setAuth({
          user: null,
          token: null,
        });
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      controller.abort();
      mounted = false;
    };
  }, []);

  useLayoutEffect(() => {
    // used to intercept all requests and fill in the token if one is stored
    const authInterceptor = api.interceptors.request.use(
      (req: RetryRequestConfig) => {
        req.headers.Authorization =
          auth.token && !req?._retry
            ? `Bearer ${auth.token}`
            : req.headers.Authorization;

        return req;
      }
    );
    return () => api.interceptors.request.eject(authInterceptor);
  }, [auth.token]);

  useLayoutEffect(() => {
    // used to handle 403 failed responses to try to get a new access token from the refresh token stored in the cookies
    // for now any 403 status is caused by the client having a refresh token but no valid access token to use
    // 401 -> unauthorized  (invalid refresh token/no refresh token found/invalid password/invalid roles and so on)
    const refreshInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const orginalRequest = error.config as RetryRequestConfig;

        const authCode=(error.response?.data as {code?:string}|undefined)?.code;
        const refreshNeeded=import.meta.env.VITE_HOSTED!=="1"||authCode==="TOKEN_EXPIRED"||authCode==="ACCESS_TOKEN_REQUIRED";
        if (error.response?.status === 403 && refreshNeeded && !orginalRequest._retry && !orginalRequest.url?.includes("/auth/refresh")) {
          try {
            // attempt to get a new access token
            const res = await api.get<refreshResponse>("/api/auth/refresh");

            orginalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            orginalRequest._retry = true;

            setAuth({ user: res.data.user, token: res.data.accessToken });

            return api(orginalRequest);
          } catch {
            setAuth({ user: null, token: null });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(refreshInterceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, loading, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
