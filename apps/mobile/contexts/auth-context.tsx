import { authClient } from "@/auth/client";
import { LoadingScreen } from "@/components/loading-screen";
import React, { createContext, ReactNode } from "react";
import { Text, View } from "react-native";

interface AuthContextType {
  session: any;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending, error } = authClient.useSession();

  const value: AuthContextType = {
    session,
    isLoading: isPending,
    error: error || null,
  };

  // Show loading state
  if (isPending) {
    return <LoadingScreen message="Loading authentication..." />;
  }

  // Show error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", textAlign: "center" }}>
          Authentication Error: {error.message}
        </Text>
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
