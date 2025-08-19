import { useThemeColor } from "@/hooks/useThemeColor";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export type ButtonProps = Readonly<{
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}>;

const Button = (props: ButtonProps) => {
  const color = useThemeColor({}, "primary");

  return (
    <TouchableOpacity
      style={[styles.wrapper, props.style]}
      onPress={props.onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Text style={[styles.inner, { color }]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    minHeight: 50,
  },
  inner: {
    fontSize: 18,
  },
});

export default Button;
