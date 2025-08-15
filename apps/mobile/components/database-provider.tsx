import { LoadingScreen } from "@/components/loading-screen";
import { useDatabase } from "@/hooks/useDatabase";
import { ReactNode } from "react";
import { Text, View } from "react-native";

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const { isSuccess: isInitialized, isLoading, error } = useDatabase();

  if (isLoading) {
    return <LoadingScreen message="Initializing database..." />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", textAlign: "center" }}>
          Database Error: {error.message}
        </Text>
      </View>
    );
  }

  if (!isInitialized) {
    return <LoadingScreen message="Database not initialized" />;
  }

  return <>{children}</>;
}
