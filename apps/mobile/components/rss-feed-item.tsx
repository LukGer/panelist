import * as AC from "@bacons/apple-colors";
import type { EntryWithFeed } from "api/database";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";

const PARENT_PADDING = 16;
const CONTENT_PADDING = 16;

export default function RssFeedItem(props: { entry: EntryWithFeed }) {
  const entry = props.entry;

  return (
    <TouchableOpacity style={styles.feedItem}>
      <View style={styles.feedHeader}>
        <Text style={styles.feedItemTitle}>{entry.title}</Text>

        {entry.feed.faviconUrl && (
          <Image source={entry.feed.faviconUrl} style={styles.feedFavicon} />
        )}
        <Text style={styles.feedSource}>{entry.feed.title}</Text>
      </View>
      <FeedItemContent entry={entry} />
      <View style={styles.feedMeta}>
        {entry.author && (
          <Text style={styles.feedMetaText}>By {entry.author}</Text>
        )}
        {entry.pubDate && (
          <Text style={styles.feedMetaText}>
            {new Date(entry.pubDate).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function FeedItemContent({ entry }: { entry: EntryWithFeed }) {
  const { width } = useWindowDimensions();

  if (!entry.description) return null;

  if (entry.isDescriptionHtml) {
    return (
      <RenderHtml
        contentWidth={width - 2 * PARENT_PADDING - 2 * CONTENT_PADDING}
        source={{ html: entry.description }}
      />
    );
  }

  return <Text style={styles.feedItemContent}> {entry.description}</Text>;
}

const styles = StyleSheet.create({
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
    gap: 8,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "ui-rounded",
    color: AC.label,
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
  feedFavicon: {
    width: 24,
    height: 24,
  },
});
