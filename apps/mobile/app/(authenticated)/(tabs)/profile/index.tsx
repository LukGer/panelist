import { useAuth } from "@/contexts/auth-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Form,
  Host,
  HStack,
  Section,
  Spacer,
  Switch,
  Text,
  Image as UIImage,
  VStack,
} from "@expo/ui/swift-ui";
import { cornerRadius, frame } from "@expo/ui/swift-ui/modifiers";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { useState } from "react";
import { Appearance } from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();

  const backgroundColor = useThemeColor({}, "background");

  if (!session) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Profile",
          headerLargeTitle: true,
          headerTransparent: true,
          contentStyle: {
            backgroundColor: backgroundColor,
          },
        }}
      />

      <Host matchContents style={{ flex: 1 }}>
        <Form>
          <Section>
            <VStack
              alignment="center"
              spacing={8}
              modifiers={[frame({ width: 999 })]}
            >
              {session.user.image && (
                <HStack
                  modifiers={[
                    frame({ width: 100, height: 100 }),
                    cornerRadius(24),
                  ]}
                >
                  <Image
                    source={{ uri: session?.user.image! }}
                    style={{ width: 100, height: 100 }}
                  />
                </HStack>
              )}
              <Text size={24} design="rounded">
                {session.user.name}
              </Text>
              <Text size={12} color="secondary">
                {session.user.email}
              </Text>
            </VStack>
          </Section>
          <AppearanceSection />
        </Form>
        {/* <Section title="Admin">
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
          </Button> */}
      </Host>
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
        <UIImage systemName={darkMode ? "moon" : "sun.max"} />
        <Text>Dark Mode</Text>
        <Spacer />
        <Switch
          value={darkMode}
          onValueChange={(value) => setDarkMode(value ? "dark" : undefined)}
        />
      </HStack>
    </Section>
  );
}
