import { createContext, useContext } from "react";

type AuthState = {
  isSignedIn: boolean;
};

export const AuthContext = createContext<AuthState>({ isSignedIn: false });

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
