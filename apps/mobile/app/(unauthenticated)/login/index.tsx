import { authClient } from "@/auth/client";
import Button from "@/components/button";
import { Text, View } from "react-native";

export default function LoginScreen() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/feed",
    });
  };

  return (
    <View>
      <Text>Login with Google</Text>

      <Button onPress={handleLogin}>Login</Button>
    </View>
  );
}
