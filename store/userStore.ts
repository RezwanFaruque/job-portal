import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { userApi } from "@/services/api";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

interface Company {
  name: string;
  location: string;
  website: string;
  description: string;
  industry: string;
}

export interface User {
  userId: string;
  userName: string;
  email: string;
  userType: string;
  company?: Company;
}

interface UserApiResponse {
  message: string;
  token: string;
  user?: User;
}

interface UserRegisterAPiResponse {
  message: string;
  data: User;
}

interface loginInfo {
  email: string;
  password: string;
}

interface RegisterInfo {
  userName: string;
  email: string;
  password: string;
  userType: string;
}

export interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  authenticate: (formData: loginInfo) => Promise<UserApiResponse>;
  register: (formData: RegisterInfo) => Promise<UserRegisterAPiResponse>;
  logout: () => void;
  hydrateAuth: () => void;
}

function saveAuth(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export const userStore = create<UserState>()(
  devtools((set) => ({
    user: null,
    token: null,

    setUser: (user) => set({ user }),

    hydrateAuth: () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (!token || !storedUser) return;

      try {
        set({ token, user: JSON.parse(storedUser) as User });
      } catch {
        clearAuth();
      }
    },

    authenticate: async (formData: loginInfo) => {
      const response = await userApi.post<UserApiResponse, loginInfo>("/login", formData);

      if (response.token && response.user) {
        saveAuth(response.token, response.user);
        set({ token: response.token, user: response.user });
      }

      return response;
    },

    register: async (formData: RegisterInfo) => {
      const response = await userApi.post<UserRegisterAPiResponse, RegisterInfo>(
        "/register",
        formData
      );
      return response;
    },

    logout: () => {
      clearAuth();
      set({ user: null, token: null });
    },
  }))
);
