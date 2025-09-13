import { authClient } from "@/auth/client";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Host,
  HStack,
  Section,
  Spacer,
  Text,
  TextField,
} from "@expo/ui/swift-ui";
import React, { useState } from "react";
import { Button, ScrollView } from "react-native";

export default function Admin() {
  const { data: session } = authClient.useSession();

  const bgColor = useThemeColor({}, "background");

  if (session?.user.role !== "admin") {
    return null;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bgColor, paddingBlock: 16 }}>
      <ImpersonateUserForm />
    </ScrollView>
  );
}

function ImpersonateUserForm() {
  const [userId, setUserId] = useState("");

  const handleImpersonate = async () => {
    await authClient.admin.impersonateUser({
      userId: userId,
    });
  };

  return (
    <Host>
      <Section title="Impersonate User">
        <HStack>
          <Text>User ID</Text>
          <TextField
            autocorrection={false}
            defaultValue={userId}
            onChangeText={setUserId}
            placeholder="User ID"
          />
        </HStack>

        <HStack>
          <Spacer />
          <Button onPress={handleImpersonate} title="Impersonate" />
        </HStack>
      </Section>
    </Host>
  );
}
