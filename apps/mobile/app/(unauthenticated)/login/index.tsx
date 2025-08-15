import { authClient } from "@/auth/client";
import Button from "@/components/button";
import { ScrollView, Text } from "react-native";

export default function LoginScreen() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/feed",
    });
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text>Login with Google</Text>

      <Button onPress={handleLogin}>Login</Button>
    </ScrollView>
  );
}
