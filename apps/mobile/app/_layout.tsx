import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { authClient } from "@/auth/client";
import LinkButton from "@/components/link-button";
import DatabaseWrapper from "@/database/wrapper";
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
        <LinkButton href="/login">Try again</LinkButton>
      </View>
    </SafeAreaView>
  );
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const isIOS = Platform.OS === "ios";
  const bgColor = useThemeColor({}, "background");

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {isIOS ? (
            <StatusBar style="auto" />
          ) : (
            <StatusBar
              style="auto"
              backgroundColor={bgColor}
              translucent={false}
            />
          )}
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

function App() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <DatabaseWrapper>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </DatabaseWrapper>
  );
}
