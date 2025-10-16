import { create } from "zustand";

interface AuthState {
  user: string | null;
  email: string | null;
  token: string | null;
  role: string | null;
  setAuth: (user: string, email: string, token: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem("user") || null,
  email: localStorage.getItem("email") || null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  setAuth: (user, email, token, role) => {
    localStorage.setItem("user", user);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    set({ user, email, token, role });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ user: null, email: null, token: null, role: null });
  },
}));
