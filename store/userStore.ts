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
  createdAt?: string;
  profilePicture?: string;
  company?: Company;
}

interface ApiUser {
  _id?: string;
  userId?: string;
  userName: string;
  email: string;
  userType: string;
  createdAt?: string;
  profilePicture?: string;
  company?: Company;
}

interface UserApiResponse {
  message: string;
  token: string;
  user?: ApiUser;
}

interface UserRegisterAPiResponse {
  message: string;
  data: User;
}

interface UserDetailsResponse {
  message: string;
  user: ApiUser;
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

export interface UpdateProfileInfo {
  userName: string;
  email: string;
  userType: string;
  profilePicture?: string;
}

export interface UserState {
  user: User | null;
  token: string | null;
  userDetails: User | null;
  isLoadingDetails: boolean;
  setUser: (user: User | null) => void;
  authenticate: (formData: loginInfo) => Promise<UserApiResponse>;
  register: (formData: RegisterInfo) => Promise<UserRegisterAPiResponse>;
  fetchUserDetails: () => Promise<UserDetailsResponse>;
  updateUserProfile: (formData: UpdateProfileInfo) => Promise<UserDetailsResponse>;
  logout: () => void;
  hydrateAuth: () => void;
}

function normalizeUser(raw: ApiUser, existing?: User | null): User {
  return {
    userId: raw._id ?? raw.userId ?? "",
    userName: raw.userName,
    email: raw.email,
    userType: raw.userType,
    createdAt: raw.createdAt,
    profilePicture: raw.profilePicture ?? existing?.profilePicture,
    company: raw.company,
  };
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
  devtools((set, get) => ({
    user: null,
    token: null,
    userDetails: null,
    isLoadingDetails: false,

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
        let existing: User | null = null;
        try {
          const stored = localStorage.getItem(AUTH_USER_KEY);
          if (stored) existing = JSON.parse(stored) as User;
        } catch {
          existing = null;
        }

        const user = normalizeUser(response.user, existing);
        saveAuth(response.token, user);
        set({ token: response.token, user, userDetails: user });
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

    fetchUserDetails: async () => {
      set({ isLoadingDetails: true });
      try {
        const response = await userApi.get<UserDetailsResponse>("/user-details");
        const existing = get().userDetails ?? get().user;
        const user = normalizeUser(response.user, existing);
        set({ userDetails: user, user: user });

        const token = get().token ?? localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          saveAuth(token, user);
        }

        return response;
      } finally {
        set({ isLoadingDetails: false });
      }
    },

    updateUserProfile: async (formData: UpdateProfileInfo) => {
      const response = await userApi.put<UserDetailsResponse, UpdateProfileInfo>(
        "/user-details",
        formData
      );
      const existing = get().userDetails ?? get().user;
      const user = {
        ...normalizeUser(response.user, existing),
        profilePicture: formData.profilePicture ?? existing?.profilePicture,
      };
      set({ userDetails: user, user });

      const token = get().token ?? localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        saveAuth(token, user);
      }

      return response;
    },

    logout: () => {
      clearAuth();
      set({ user: null, token: null, userDetails: null });
    },
  }))
);
