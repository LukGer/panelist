import LinkButton from "@/components/link-button";
import { Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View>
      <Text>Login</Text>

      <LinkButton href="/(tabs)/feed">Feed</LinkButton>
    </View>
  );
}
