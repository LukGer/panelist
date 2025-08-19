import RssFeedItem from "@/components/rss-feed-item";
import { useSubscribedEntries } from "@/hooks/use-subscribed-entries";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as AC from "@bacons/apple-colors";
import { Stack } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FeedScreen() {
  const backgroundColor = useThemeColor({}, "background");

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
        }}
      />
      <FeedList />
    </>
  );
}

function FeedList() {
  const tintColor = useThemeColor({}, "primary");

  const query = useSubscribedEntries();

  if (query.isLoading && !query.data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loadingText}>Loading your feed...</Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load feed</Text>
        <Text style={styles.errorText}>{query.error.message}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => query.refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!query.isSuccess || query.data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ fontSize: 16, color: AC.secondaryLabel }}>
          No entries found
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={query.data}
      renderItem={({ item }) => <RssFeedItem entry={item} />}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={query.isRefetching}
          onRefresh={() => query.refetch()}
          tintColor={tintColor}
          colors={[tintColor]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
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
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  feedItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  feedSource: {
    fontSize: 14,
    color: AC.secondaryLabel,
  },
  feedItemContent: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 8,
  },
  feedMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedMetaText: {
    fontSize: 14,
    color: "#999",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
  feedFavicon: {
    width: 24,
    height: 24,
  },
});
