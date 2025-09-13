import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type ContainerProps = Readonly<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}>;

const Container = (props: ContainerProps) => (
  <ScrollView
    automaticallyAdjustKeyboardInsets={true}
    contentInsetAdjustmentBehavior="automatic"
    style={styles.scrollWrapper}
  >
    <View style={[styles.container, props.style]}>{props.children}</View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 40,
    paddingLeft: 15,
  },
  scrollWrapper: {
    minHeight: "100%",
  },
});

export default Container;
