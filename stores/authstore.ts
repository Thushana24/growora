import { create } from "zustand";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";
import { Dispatch, SetStateAction } from "react";
import { User } from "@/generated/prisma/client";
import { RegisterUserResponse } from "@/app/api/types";

export type SafeUser = Omit<RegisterUserResponse, "password">;

interface IAuthStore {
  states: {
    user: SafeUser | null;
    authToken: string | null;
    role: SafeUser["role"] | null; // 'BUYER' | 'OWNER' | null
  };
  actions: {
    setUser: Dispatch<SetStateAction<SafeUser | null>>;
    setAuthToken: Dispatch<SetStateAction<string | null>>;
    setRole: Dispatch<SetStateAction<SafeUser["role"] | null>>;
    logout: () => void;
  };
}

const useAuthStore = create<IAuthStore>()((set) => ({
  states: {
    user: (JSON.parse(Cookie.get(cookieKeys.USER) || "null") as SafeUser) || null,
    authToken: (Cookie.get(cookieKeys.USER_TOKEN) as string) || null,
    role: (JSON.parse(Cookie.get(cookieKeys.USER) || "null") as SafeUser)?.role || null,
  },
  actions: {
    setUser: (value) =>
      set(({ states }) => {
        const newUser =
          typeof value === "function" ? value(states.user) : value;
        return {
          states: {
            ...states,
            user: newUser,
            role: newUser?.role || null,
          },
        };
      }),

    setAuthToken: (value) =>
      set(({ states }) => ({
        states: {
          ...states,
          authToken:
            typeof value === "function" ? value(states.authToken) : value,
        },
      })),

    setRole: (value) =>
      set(({ states }) => ({
        states: {
          ...states,
          role: typeof value === "function" ? value(states.role) : value,
        },
      })),

    logout: () => {
      Cookie.remove(cookieKeys.USER_TOKEN);
      Cookie.remove(cookieKeys.USER);
      return set({
        states: {
          user: null,
          authToken: null,
          role: null,
        },
      });
    },
  },
}));

export const useAuth = () => useAuthStore((state) => state.states);
export const useAuthActions = () => useAuthStore((state) => state.actions);
