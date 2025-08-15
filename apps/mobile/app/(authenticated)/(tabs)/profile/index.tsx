import * as Form from "@/components/ui/form";
import { Rounded } from "@/components/ui/rounded";
import { useAuth } from "@/contexts/auth-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { useState } from "react";
import { Alert, Appearance } from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();

  const backgroundColor = useThemeColor({}, "background");

  const handleFeaturePress = (featureName: string) => {
    Alert.alert(
      "Feature Coming Soon",
      `${featureName} will be available in a future update.`
    );
  };

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

        <Form.Section title="Reading Preferences">
          <Form.FormItem
            onPress={() => handleFeaturePress("Font Size Settings")}
          >
            <Form.Text systemImage="textformat.size">Font Size</Form.Text>
            <Form.Text hint="Medium" />
          </Form.FormItem>
          <Form.FormItem
            onPress={() => handleFeaturePress("Line Spacing Settings")}
          >
            <Form.Text systemImage="line.3.horizontal">Line Spacing</Form.Text>
            <Form.Text hint="1.2" />
          </Form.FormItem>
          <Form.FormItem
            onPress={() => handleFeaturePress("Reading Mode Settings")}
          >
            <Form.Text systemImage="text.alignleft">Reading Mode</Form.Text>
            <Form.Text hint="Clean View" />
          </Form.FormItem>
        </Form.Section>

        <DarkmodeSection />
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
        // Add some time for the iOS switch animation to complete
      }, 100);
    },
  ] as const;
}

function DarkmodeSection() {
  const [darkMode, setDarkMode] = useOptimisticDarkMode();
  return (
    <Form.Section title="Toggle">
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
