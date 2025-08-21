import { useThemeColor } from "@/hooks/useThemeColor";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFeedDetails } from "../../../../hooks/use-feed-details";

export default function FeedDetailsScreen() {
  const { feedId } = useLocalSearchParams<{ feedId: string }>();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "primary");
  const query = useFeedDetails(feedId);

  const handleOpenWebsite = async () => {
    if (query.data?.siteUrl) {
      await WebBrowser.openBrowserAsync(query.data.siteUrl);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Feed Details",
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
          headerRight: query.data?.siteUrl
            ? () => (
                <TouchableOpacity
                  onPress={handleOpenWebsite}
                  style={{
                    padding: 6,
                  }}
                >
                  <SymbolView
                    name="safari"
                    size={24}
                    tintColor={tintColor}
                    type="hierarchical"
                  />
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <FeedDetailsContent feedId={feedId} tintColor={tintColor} query={query} />
    </>
  );
}

function FeedDetailsContent({
  feedId,
  tintColor,
  query,
}: {
  feedId: string;
  tintColor: string;
  query: ReturnType<typeof useFeedDetails>;
}) {
  if (query.isLoading && !query.data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loadingText}>Loading feed details...</Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load feed details</Text>
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

  if (!query.isSuccess || !query.data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Feed not found</Text>
      </View>
    );
  }

  const feed = query.data;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Feed Header */}
      <View style={styles.header}>
        <View style={styles.feedInfo}>
          {feed.faviconUrl && (
            <Image source={feed.faviconUrl} style={styles.favicon} />
          )}
          <View style={styles.titleSection}>
            <Text style={styles.feedTitle}>{feed.title}</Text>
          </View>
        </View>

        {feed.description && (
          <Text style={styles.description}>{feed.description}</Text>
        )}
      </View>

      {/* Feed Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{feed._count.entries}</Text>
          <Text style={styles.statLabel}>Articles</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{feed._count.subscribers}</Text>
          <Text style={styles.statLabel}>Subscribers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {feed.isActive ? "Active" : "Inactive"}
          </Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      {/* Latest Entry */}
      {feed.latestEntry && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Article</Text>
          <View style={styles.latestEntryCard}>
            <Text style={styles.latestEntryTitle}>
              {feed.latestEntry.title}
            </Text>
            <View style={styles.latestEntryMeta}>
              {feed.latestEntry.author && (
                <Text style={styles.latestEntryAuthor}>
                  By {feed.latestEntry.author}
                </Text>
              )}
              {feed.latestEntry.pubDate && (
                <Text style={styles.latestEntryDate}>
                  {new Date(feed.latestEntry.pubDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Categories */}
      {feed.categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {feed.categories.map((category: { id: string; name: string }) => (
              <View key={category.id} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Feed Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feed Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Feed URL:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {feed.url}
            </Text>
          </View>
          {feed.lastFetched && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated:</Text>
              <Text style={styles.infoValue}>
                {new Date(feed.lastFetched).toLocaleString()}
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {new Date(feed.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: AC.secondarySystemBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  favicon: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 6,
  },
  titleSection: {
    flex: 1,
  },
  feedTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "ui-rounded",
    color: AC.label,
    marginBottom: 4,
  },
  siteUrl: {
    fontSize: 16,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: AC.secondaryLabel,
    lineHeight: 24,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: AC.secondarySystemBackground,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: AC.label,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: AC.secondaryLabel,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AC.label,
    marginBottom: 12,
  },
  latestEntryCard: {
    backgroundColor: AC.secondarySystemBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  latestEntryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AC.label,
    marginBottom: 8,
  },
  latestEntryMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  latestEntryAuthor: {
    fontSize: 14,
    color: AC.secondaryLabel,
  },
  latestEntryDate: {
    fontSize: 14,
    color: AC.secondaryLabel,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryTag: {
    backgroundColor: AC.tertiarySystemBackground,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 14,
    color: AC.secondaryLabel,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: AC.secondarySystemBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: AC.label,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: AC.secondaryLabel,
    flex: 2,
    textAlign: "right",
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
    textAlign: "center",
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
});
