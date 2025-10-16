import { useMutation } from "@tanstack/react-query";
import api, { suppressToast } from "../api/base";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../contexts/ToastContext";

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}
interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
}
interface AuthResponse {
  token: string;
  type?: string;
  username: string;
  email?: string;
  role: string;
}
interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      try {
        const res = await api.post("/auth/login", data, suppressToast());
        if (!res.data.success)
          throw new Error(res.data.message || "Login failed");
        const auth = res.data.data as AuthResponse;
        setAuth(auth.username, auth.email || "", auth.token, auth.role);
        toast.success(`Welcome back, ${auth.username}!`);
        return auth;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Login failed";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}

export function useRegister() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      try {
        const res = await api.post(
          "/auth/register/start",
          data,
          suppressToast()
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Registration failed");
        toast.success("Registration started! Please check your email for OTP.");
        return res.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Registration failed";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}

export function useVerifyOtp() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      return toast.promise(
        (async () => {
          try {
            const res = await api.post(
              "/auth/register/verify",
              data,
              suppressToast()
            );
            if (!res.data.success)
              throw new Error(res.data.message || "OTP verification failed");
            const auth = res.data.data as AuthResponse;
            setAuth(
              auth.username,
              auth.email || data.email,
              auth.token,
              auth.role
            );
            return auth;
          } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const message =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "OTP verification failed";
            throw new Error(message);
          }
        })(),
        {
          loading: "Verifying OTP...",
          success: (auth) => `Welcome, ${auth.username}!`,
          error: (err) => err.message || "OTP verification failed",
        }
      );
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const toast = useToast();

  return () => {
    logout();
    toast.info("You have been logged out");
  };
}
