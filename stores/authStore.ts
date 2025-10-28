import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole, rolePermissions, RolePermissions } from "@/types/user";
import { mockUsers } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentRole: UserRole;
  assignedLGUId?: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setRole: (role: UserRole) => void;
  getPermissions: () => RolePermissions;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      currentRole: "super_admin",
      assignedLGUId: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Mock authentication - find user by email
          await new Promise(resolve => setTimeout(resolve, 500));
          const user = mockUsers.find(u => u.email === email);
          
          if (!user || password !== "password") {
            throw new Error("Invalid credentials");
          }

          // Mock: admin_staff users are assigned to Dalaguete LGU (lgu-001)
          const assignedLGUId = user.role === "admin_staff" ? "lgu-001" : null;

          set({
            user,
            token: "mock-token-" + Date.now(),
            isAuthenticated: true,
            currentRole: user.role,
            assignedLGUId,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name?: string) => {
        set({ isLoading: true });
        try {
          // Mock registration
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newUser: User = {
            id: `USER-${Date.now()}`,
            name: name || email.split("@")[0],
            email,
            role: "admin_staff",
            createdAt: new Date(),
          };

          set({
            user: newUser,
            token: "mock-token-" + Date.now(),
            isAuthenticated: true,
            currentRole: newUser.role,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          currentRole: "super_admin",
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setRole: (role: UserRole) => {
        set({ currentRole: role });
      },

      getPermissions: () => {
        const { currentRole } = get();
        return rolePermissions[currentRole];
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        currentRole: state.currentRole,
        assignedLGUId: state.assignedLGUId,
      }),
    }
  )
);
