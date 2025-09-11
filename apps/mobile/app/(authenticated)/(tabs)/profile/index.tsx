import { authClient } from "@/auth/client";
import { useAuth } from "@/contexts/auth-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as AC from "@bacons/apple-colors";
import {
  Button,
  Form,
  Host,
  HStack,
  Section,
  Spacer,
  Switch,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import { glassEffect, padding } from "@expo/ui/swift-ui/modifiers";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Appearance, ScrollView } from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();

  const backgroundColor = useThemeColor({}, "background");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Profile",
          headerLargeTitle: true,
          contentStyle: {
            backgroundColor: backgroundColor,
          },
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ gap: 16 }}
      >
        <Host style={{ flex: 1 }}>
          <Form>
            <Section>
              <VStack alignment="center">
                {session?.user.image && (
                  <Image source={{ uri: session?.user.image! }} />
                )}
                <Text
                  size={24}
                  modifiers={[
                    padding({
                      all: 16,
                    }),
                    glassEffect({
                      glass: {
                        variant: "clear",
                      },
                    }),
                  ]}
                >
                  {session?.user.name ?? ""}
                </Text>
                <Text size={12} color="secondary">
                  {session?.user.email ?? ""}
                </Text>
              </VStack>
            </Section>
          </Form>
          <AppearanceSection />
          <Section title="Admin">
            <Link href="/admin">
              <Button>
                <SymbolView
                  name="gear.badge"
                  tintColor={AC.systemOrange}
                  size={18}
                />
                <Text color="primary">Admin Panel</Text>
              </Button>
            </Link>
          </Section>
          <Button onPress={() => authClient.signOut()}>
            <Text color={AC.systemRed.toString()}>Sign Out</Text>
          </Button>
        </Host>
      </ScrollView>
    </>
  );
}

function useOptimisticDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    return Appearance.getColorScheme() === "dark";
  });

  return [
    darkMode,
    (value: Parameters<typeof Appearance.setColorScheme>[0]) => {
      setDarkMode(value === "dark");
      setTimeout(() => {
        Appearance.setColorScheme(value);
      }, 100);
    },
  ] as const;
}

function AppearanceSection() {
  const [darkMode, setDarkMode] = useOptimisticDarkMode();
  return (
    <Section title="Appearance">
      <HStack spacing={8}>
        <SymbolView name={darkMode ? "moon" : "sun.max"} />
        <Text>Appearance</Text>
        <Spacer />
        <Switch
          value={darkMode}
          onValueChange={(value) => setDarkMode(value ? "dark" : undefined)}
        />
      </HStack>
    </Section>
  );
}
