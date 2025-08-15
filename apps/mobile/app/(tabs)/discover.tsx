import { StyleSheet, Text, View } from "react-native";

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text>Discover</Text>
      <Text>Discover new content here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
