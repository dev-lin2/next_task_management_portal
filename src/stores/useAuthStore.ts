import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  username: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      user: null,
      token: null,
      login: async (username: string, password: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
          set({ user: data.user, token: data.token });
        } else {
          throw new Error(data.message || "Login failed");
        }
      },
      
      register: async (username: string, password: string, name: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, name }),
        });
        const data = await response.json();
        if (response.ok) {
          set({ user: data.user, token: data.token });
        } else {
          throw new Error(data.message || "Registration failed");
        }
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
