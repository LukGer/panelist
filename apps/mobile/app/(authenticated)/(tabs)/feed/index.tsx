import Container from "@/components/container";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FeedScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const backgroundColor = useThemeColor({}, "background");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement your search logic here
    console.log("Searching for:", text);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Feed",
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerStyle: {
            backgroundColor: "transparent",
          },
          contentStyle: {
            backgroundColor: backgroundColor,
          },
          headerSearchBarOptions: {
            placement: "stacked",
            hideWhenScrolling: true,
            onChangeText: (event) => {
              handleSearch(event.nativeEvent.text);
            },
            placeholder: "Search feeds and articles...",
            autoCapitalize: "none",
          },
        }}
      />
      <Container>
        <View style={styles.feedItem}>
          <Text style={styles.feedItemTitle}>Welcome to your Feed!</Text>
          <Text style={styles.feedItemContent}>
            This is where you&apos;ll see your personalized content and updates.
          </Text>
        </View>

        <View style={styles.feedItem}>
          <Text style={styles.feedItemTitle}>Sample Post</Text>
          <Text style={styles.feedItemContent}>
            This is an example of how your feed items will appear. You can
            scroll through your content here.
          </Text>
        </View>

        <View style={styles.feedItem}>
          <Text style={styles.feedItemTitle}>Another Update</Text>
          <Text style={styles.feedItemContent}>
            More content will be displayed here as you interact with the app.
          </Text>
        </View>
      </Container>

      {/* Search Results */}
      {searchQuery.length > 0 && (
        <View style={styles.searchResults}>
          <Text style={styles.searchResultsText}>
            Searching for &quot;{searchQuery}&quot;...
          </Text>
          {/* Add your search results here */}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  feedItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feedItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  feedItemContent: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  // Search Results Styles
  searchResults: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    margin: 16,
    borderRadius: 12,
  },
  searchResultsText: {
    fontSize: 16,
    opacity: 0.6,
    color: "#666",
  },
});
