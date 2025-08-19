import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { DatabaseProvider } from "@/components/database-provider";
import LinkButton from "@/components/link-button";
import { AuthProvider } from "@/contexts/auth-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ErrorBoundary from "react-native-error-boundary";

const queryClient = new QueryClient();

const ErrorFallbackComponent = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Oops!</Text>
        <Text>An unexpected error occured.</Text>
        <LinkButton href="/login">Try again</LinkButton>
      </View>
    </SafeAreaView>
  );
};

function RootLayoutContent() {
  const isIOS = Platform.OS === "ios";
  const bgColor = useThemeColor({}, "background");

  return (
    <>
      {isIOS ? (
        <StatusBar style="auto" />
      ) : (
        <StatusBar style="auto" backgroundColor={bgColor} translucent={false} />
      )}
      <DatabaseProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="(authenticated)/(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(unauthenticated)/login/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthProvider>
      </DatabaseProvider>
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RootLayoutContent />
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
