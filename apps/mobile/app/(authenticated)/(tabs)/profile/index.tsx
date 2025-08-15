import Container from "@/components/container";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text } from "react-native";

export default function ProfileScreen() {
  return (
    <>
      <Container style={{ backgroundColor: useThemeColor({}, "background") }}>
        <Text>Profile</Text>
      </Container>
    </>
  );
}
