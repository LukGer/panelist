import { StyleSheet, Text, View } from "react-native";

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text>Saved</Text>
      <Text>Your saved items will appear here.</Text>
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
