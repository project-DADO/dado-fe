import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userAvatar?: string;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userAvatar: undefined,
  logout: () => set({ isLoggedIn: false, userAvatar: undefined }),
}));
