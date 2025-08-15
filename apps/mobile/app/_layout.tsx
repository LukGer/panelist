import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import LinkButton from "@/components/link-button";
import { useDatabase } from "@/hooks/useDatabase";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import ErrorBoundary from "react-native-error-boundary";

const ErrorFallbackComponent = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Oops!</Text>
        <Text>An unexpected error occured.</Text>
        <LinkButton href="/(login)">Try again</LinkButton>
      </View>
    </SafeAreaView>
  );
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

function App() {
  const colorScheme = useColorScheme();
  const isIOS = Platform.OS === "ios";
  const bgColor = useThemeColor({}, "background");

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
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {isIOS ? (
          <StatusBar style="auto" />
        ) : (
          <StatusBar
            style="auto"
            backgroundColor={bgColor}
            translucent={false}
          />
        )}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
