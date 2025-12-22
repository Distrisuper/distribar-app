import { create } from "zustand";
import { setCookie, deleteCookie, getCookie } from "../utils/cookies";

interface AuthStore {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  checkAuth: () => void;
}

const STAFF_PASSWORD = "staff123";
const AUTH_COOKIE_NAME = "staff_auth_token";

// Valor inicial seguro para SSR (cacheado)
let initialAuthState: boolean | null = null;
const getInitialAuthState = (): boolean => {
  if (initialAuthState !== null) return initialAuthState;
  if (typeof window === "undefined") {
    initialAuthState = false;
    return false;
  }
  const cookie = getCookie(AUTH_COOKIE_NAME);
  initialAuthState = cookie === "authenticated";
  return initialAuthState;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: getInitialAuthState(),
  login: (password: string) => {
    if (password === STAFF_PASSWORD) {
      if (typeof window !== "undefined") {
        setCookie(AUTH_COOKIE_NAME, "authenticated", 1);
      }
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    if (typeof window !== "undefined") {
      deleteCookie(AUTH_COOKIE_NAME);
    }
    set({ isAuthenticated: false });
  },
  checkAuth: () => {
    if (typeof window === "undefined") return;
    const cookie = getCookie(AUTH_COOKIE_NAME);
    if (cookie === "authenticated") {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },
}));

