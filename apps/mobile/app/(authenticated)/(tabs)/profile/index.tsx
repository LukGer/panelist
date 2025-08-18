import * as Form from "@/components/ui/form";
import { Rounded } from "@/components/ui/rounded";
import { useAuth } from "@/contexts/auth-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { useState } from "react";
import { Appearance } from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();

  const backgroundColor = useThemeColor({}, "background");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Profile",
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerStyle: {
            backgroundColor: "transparent",
          },
          contentStyle: {
            backgroundColor: backgroundColor,
          },
        }}
      />
      <Form.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ gap: 16 }}
      >
        <Form.Section>
          <Rounded padding style={{ alignItems: "center", gap: 8, flex: 1 }}>
            <Image
              source={{ uri: session?.user.image! }}
              style={{
                aspectRatio: 1,
                height: 64,
                borderRadius: 8,
              }}
            />
            <Form.Text
              style={{
                fontSize: 20,
                fontFamily: "ui-rounded",
                fontWeight: "600",
              }}
            >
              {session?.user.name}
            </Form.Text>
            <Form.Text style={{ textAlign: "center", fontSize: 14 }}>
              {session?.user.email}
            </Form.Text>
          </Rounded>
        </Form.Section>

        <AppearanceSection />
      </Form.ScrollView>
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
    <Form.Section title="Appearance">
      <Form.Toggle
        systemImage={{ name: darkMode ? "moon" : "sun.max" }}
        value={darkMode}
        onValueChange={(value) => setDarkMode(value ? "dark" : undefined)}
      >
        Always Dark
      </Form.Toggle>
    </Form.Section>
  );
}
