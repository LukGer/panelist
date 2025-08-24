import { useEntryDetails } from "@/hooks/use-entry-details";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as AC from "@bacons/apple-colors";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";

function EntryContentRenderer({
  content,
  isHtml,
  width,
  style,
}: {
  content: string;
  isHtml: boolean;
  width: number;
  style: any;
}) {
  if (!content) return null;

  if (isHtml) {
    return (
      <RenderHtml
        contentWidth={width - 32} // Account for padding
        source={{ html: content }}
        baseStyle={style}
        tagsStyles={{
          p: { marginBottom: 8 },
          h1: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
          h2: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
          h3: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
          ul: { marginBottom: 8 },
          ol: { marginBottom: 8 },
          li: { marginBottom: 4 },
          blockquote: {
            borderLeftWidth: 4,
            borderLeftColor: "#C7C7CC", // iOS tertiary label color
            paddingLeft: 12,
            marginVertical: 8,
            fontStyle: "italic",
          },
          a: { color: "#007AFF" }, // iOS blue color for links
          strong: { fontWeight: "bold" },
          em: { fontStyle: "italic" },
        }}
      />
    );
  }

  return <Text style={style}>{content}</Text>;
}

export default function EntryDetailsScreen() {
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "primary");
  const { width } = useWindowDimensions();

  console.log("EntryDetailsScreen - entryId:", entryId);

  const query = useEntryDetails(entryId);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: query.data?.title || "Article",
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
      {query.isLoading && !query.data ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <Text style={styles.loadingText}>Loading article...</Text>
          <Text style={styles.loadingText}>Entry ID: {entryId}</Text>
        </View>
      ) : query.isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load article</Text>
          <Text style={styles.errorText}>Entry ID: {entryId}</Text>
          <Text style={styles.errorText}>{query.error.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => query.refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : query.data ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.content}>
            {(query.data.description || query.data.summary) && (
              <EntryContentRenderer
                content={query.data.description || query.data.summary || ""}
                isHtml={query.data.isDescriptionHtml}
                width={width}
                style={styles.description}
              />
            )}

            {query.data.content && (
              <EntryContentRenderer
                content={query.data.content}
                isHtml={false} // Assuming content is typically plain text
                width={width}
                style={styles.body}
              />
            )}

            {!query.data.description &&
              !query.data.summary &&
              !query.data.content && (
                <Text style={styles.body}>No content available</Text>
              )}
          </View>
        </ScrollView>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AC.secondaryLabel,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30", // iOS red color for errors
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: AC.secondarySystemBackground,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: AC.label,
    fontWeight: "600",
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
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 4,
  },
  titleSection: {
    flex: 1,
  },
  source: {
    fontSize: 14,
    color: AC.secondaryLabel,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: AC.tertiaryLabel,
    marginTop: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "ui-rounded",
    color: AC.label,
    marginBottom: 8,
    lineHeight: 34,
  },
  author: {
    fontSize: 16,
    color: AC.secondaryLabel,
    fontStyle: "italic",
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 18,
    color: AC.label,
    fontWeight: "600",
    marginBottom: 16,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    color: AC.label,
    lineHeight: 24,
  },
  actionContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
