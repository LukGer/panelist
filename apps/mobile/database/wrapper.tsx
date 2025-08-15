import { useDatabase } from "@/hooks/useDatabase";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function DatabaseWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuccess: isInitialized, isLoading, error } = useDatabase();

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [isInitialized]);

  if (isLoading) {
    return null;
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

  return children;
}
