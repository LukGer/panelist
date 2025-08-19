import { authClient } from "@/auth/client";
import * as Form from "@/components/ui/form";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { Button } from "react-native";

export default function Admin() {
  const { data: session } = authClient.useSession();

  const bgColor = useThemeColor({}, "background");

  if (session?.user.role !== "admin") {
    return null;
  }

  return (
    <Form.ScrollView
      style={{ flex: 1, backgroundColor: bgColor, paddingBlock: 16 }}
    >
      <ImpersonateUserForm />
    </Form.ScrollView>
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
    <Form.Section title="Impersonate User">
      <Form.HStack>
        <Form.Text>User ID</Form.Text>
        <Form.TextField
          value={userId}
          onChangeText={setUserId}
          placeholder="User ID"
        />
      </Form.HStack>

      <Form.HStack>
        <Form.Spacer />
        <Button onPress={handleImpersonate} title="Impersonate" />
      </Form.HStack>
    </Form.Section>
  );
}
