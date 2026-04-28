import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { userApi } from "@/services/api";


interface Company  {
    name: string,
    location: string,
    website: string,
    description: string,
    industry: string,
}

export interface User   {
    userId : string,
    userName: string,
    email: string,
    userType : string,
    company? : Company,
}

interface UserApiResponse  {
    message: string,
    token: string,
    user?: User
}

interface loginInfo {
    email: string,
    password: string,
}

export interface UserState {
    user: User,
    setUser: (user: User) => void;
    authenticate : (formData: loginInfo) => Promise<void>;
}

export const userStore = create<UserState>()(
    devtools((set) => ({
        user: null,
        setUser: (user) => set({user}),
        authenticate: async(formData: loginInfo) =>  {
            try {
                console.log(formData)
                const response = await userApi.post<UserApiResponse , loginInfo>("/login",formData);
                console.log(response);
            } catch (error) {
                console.log('Failed to authenticate user',error);
            }
        },

    }))
);