import { createContext, useContext } from "react";

export interface AuthContextValue {
  email: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  enterDemo: () => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  email: null,
  isAdmin: false,
  isLoading: true,
  isDemo: false,
  signIn: async () => {},
  enterDemo: () => {},
  signOut: async () => {},
});

export const useAuth = (): AuthContextValue => useContext(AuthContext);
