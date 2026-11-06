import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { userApi } from "@/services/api";
import { useSavedJobStore } from "@/store/savedJobStore";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

interface Company {
  name: string;
  location: string;
  website: string;
  description: string;
  industry: string;
}

export type SocialLinkPlatform =
  | "website"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "googlePlus";

export type SocialLinks = Partial<Record<SocialLinkPlatform, string>>;

export interface User {
  /** User profile document id — required for job `postedBy` references */
  profileId: string;
  /** Auth account id when separate from profile */
  userId: string;
  userName: string;
  email: string;
  userType: string;
  createdAt?: string;
  profilePicture?: string;
  jobCategory?: string[];
  skills?: string[];
  about?: string;
  company?: Company;
  socialLinks?: SocialLinks;
}

interface ApiUser {
  _id?: string;
  userId?: string;
  userName?: string;
  email?: string;
  userType?: string;
  createdAt?: string;
  profilePicture?: string;
  jobCategory?: string[];
  skills?: string[];
  about?: string;
  company?: Company;
  socialLinks?: SocialLinks;
}

interface UserApiResponse {
  message?: string;
  token: string;
  user?: ApiUser;
  profileLoadError?: string;
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

export interface UpdateCandidateProfileInfo {
  userName: string;
  email: string;
  jobCategory: string[];
  skills: string[];
  about: string;
  profilePicture?: File;
}

interface ProfileUpdateResponse {
  message?: string;
  user?: ApiUser;
}

export interface ChangePasswordInfo {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  message?: string;
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
  updateCandidateProfile: (
    formData: UpdateCandidateProfileInfo
  ) => Promise<ProfileUpdateResponse>;
  setSocialLink: (platform: SocialLinkPlatform, url: string) => void;
  changePassword: (
    formData: ChangePasswordInfo
  ) => Promise<ChangePasswordResponse | undefined>;
  logout: () => void;
  hydrateAuth: () => void;
}

function normalizeUser(raw: ApiUser, existing?: User | null): User {
  const profileId = raw._id ?? existing?.profileId ?? "";
  const authUserId = raw.userId ?? existing?.userId ?? "";

  return {
    profileId: profileId || authUserId,
    userId: authUserId || profileId,
    userName: raw.userName ?? existing?.userName ?? "",
    email: raw.email ?? existing?.email ?? "",
    userType: raw.userType ?? existing?.userType ?? "",
    createdAt: raw.createdAt,
    profilePicture: raw.profilePicture ?? existing?.profilePicture,
    jobCategory: raw.jobCategory ?? existing?.jobCategory ?? [],
    skills: raw.skills ?? existing?.skills ?? [],
    about: raw.about ?? existing?.about ?? "",
    company: raw.company,
    socialLinks: raw.socialLinks ?? existing?.socialLinks ?? {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findApiUser(value: unknown): ApiUser | null {
  let current: unknown = value;

  for (let depth = 0; depth < 4 && isRecord(current); depth += 1) {
    if (
      typeof current.userName === "string" ||
      typeof current.email === "string"
    ) {
      return current as ApiUser;
    }

    if (isRecord(current.user)) {
      current = current.user;
    } else if (isRecord(current.data)) {
      current = current.data;
    } else if (isRecord(current.profile)) {
      current = current.profile;
    } else {
      break;
    }
  }

  return null;
}

function findAuthToken(value: unknown): string | null {
  let current: unknown = value;

  for (let depth = 0; depth < 4 && isRecord(current); depth += 1) {
    if (typeof current.token === "string" && current.token) {
      return current.token;
    }
    if (isRecord(current.data)) {
      current = current.data;
    } else if (isRecord(current.user)) {
      current = current.user;
    } else {
      break;
    }
  }

  return null;
}

function findApiMessage(value: unknown): string | undefined {
  let current: unknown = value;

  for (let depth = 0; depth < 4 && isRecord(current); depth += 1) {
    if (typeof current.message === "string") return current.message;
    if (isRecord(current.data)) {
      current = current.data;
    } else {
      break;
    }
  }

  return undefined;
}

export function getPostedById(user: User | null | undefined): string {
  if (!user) return "";
  return user.profileId || user.userId;
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
        const parsed = JSON.parse(storedUser) as Partial<User>;
        const user: User = {
          profileId: parsed.profileId ?? parsed.userId ?? "",
          userId: parsed.userId ?? parsed.profileId ?? "",
          userName: parsed.userName ?? "",
          email: parsed.email ?? "",
          userType: parsed.userType ?? "",
          createdAt: parsed.createdAt,
          profilePicture: parsed.profilePicture,
          jobCategory: parsed.jobCategory ?? [],
          skills: parsed.skills ?? [],
          about: parsed.about ?? "",
          company: parsed.company,
        };
        set({ token, user });
      } catch {
        clearAuth();
      }
    },

    authenticate: async (formData: loginInfo) => {
      const response = await userApi.post<unknown, loginInfo>("/login", formData);
      const token = findAuthToken(response);
      if (!token) {
        throw new Error("Login succeeded without an authentication token.");
      }

      const apiUser = findApiUser(response);
      const fallbackName = formData.email.split("@")[0] || formData.email;
      const user = normalizeUser(
        {
          ...apiUser,
          userName: apiUser?.userName?.trim() || fallbackName,
          email: apiUser?.email || formData.email,
        },
        get().user
      );
      saveAuth(token, user);
      useSavedJobStore.getState().clearSavedJobs();
      const hasProfileName = Boolean(apiUser?.userName?.trim());
      set({ token, user, userDetails: hasProfileName ? user : null });

      let profileLoadError: string | undefined;
      if (!hasProfileName) {
        try {
          await get().fetchUserDetails();
        } catch (error) {
          profileLoadError =
            error instanceof Error
              ? error.message
              : "Could not load your profile details.";
        }
      }

      return {
        token,
        user: apiUser ?? undefined,
        message: findApiMessage(response),
        profileLoadError,
      };
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
        const rawResponse = await userApi.get<unknown>("/user-details");
        const apiUser = findApiUser(rawResponse);
        if (!apiUser) {
          throw new Error("The user details response did not include a user.");
        }

        const existing = get().userDetails ?? get().user;
        const user = normalizeUser(apiUser, existing);
        set({ userDetails: user, user: user });

        const token = get().token ?? localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          saveAuth(token, user);
        }

        return {
          message: findApiMessage(rawResponse) ?? "",
          user: apiUser,
        };
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

    updateCandidateProfile: async (formData: UpdateCandidateProfileInfo) => {
      const requestBody = new FormData();
      requestBody.append("userName", formData.userName);
      requestBody.append("email", formData.email);
      requestBody.append("jobCategory", JSON.stringify(formData.jobCategory));
      requestBody.append("skills", JSON.stringify(formData.skills));
      requestBody.append("about", formData.about);
      if (formData.profilePicture) {
        requestBody.append("profilePicture", formData.profilePicture);
      }

      const response =
        (await userApi.patch<
          ProfileUpdateResponse | undefined,
          FormData
        >("/profile", requestBody)) ?? {};
      const existing = get().userDetails ?? get().user;
      const user = {
        ...normalizeUser(
          response.user ?? {
            userName: formData.userName,
            email: formData.email,
            userType: existing?.userType ?? "",
          },
          existing
        ),
        jobCategory: formData.jobCategory,
        skills: formData.skills,
        about: formData.about,
      };
      set({ userDetails: user, user });

      const token = get().token ?? localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        saveAuth(token, user);
      }

      return response;
    },

    setSocialLink: (platform, url) => {
      const currentUser = get().userDetails ?? get().user;
      if (!currentUser) {
        throw new Error("You must be signed in to update social links.");
      }

      const socialLinks = { ...currentUser.socialLinks };
      if (url) {
        socialLinks[platform] = url;
      } else {
        delete socialLinks[platform];
      }

      const user = { ...currentUser, socialLinks };
      set({ user, userDetails: get().userDetails ? user : get().userDetails });

      const token = get().token ?? localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        saveAuth(token, user);
      }
    },

    changePassword: async (formData: ChangePasswordInfo) =>
      userApi.patch<ChangePasswordResponse | undefined, ChangePasswordInfo>(
        "/change-password",
        formData
      ),

    logout: () => {
      clearAuth();
      useSavedJobStore.getState().clearSavedJobs();
      set({ user: null, token: null, userDetails: null });
    },
  }))
);
