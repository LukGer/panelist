import { SubscribedEntry } from "@/hooks/use-subscribed-entries";
import * as AC from "@bacons/apple-colors";
import type { EntryWithFeed } from "@panelist/api/database";
import { Image } from "expo-image";
import { Link } from "expo-router";
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

export default function RssFeedItem(props: { entry: SubscribedEntry }) {
  const entry = props.entry;

  return (
    <Link
      href={{
        pathname: "/feed/entry/[entryId]",
        params: { entryId: entry.id },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.feedItem}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedItemTitle}>{entry.title}</Text>
            <Link
              href={{
                pathname: "/feed/[feedId]",
                params: { feedId: entry.feedId },
              }}
              asChild
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                {entry.feed.faviconUrl && (
                  <Image
                    source={entry.feed.faviconUrl}
                    style={styles.feedFavicon}
                  />
                )}
                <Text style={styles.feedSource}>{entry.feed.title}</Text>
              </TouchableOpacity>
            </Link>
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
        </View>
      </TouchableOpacity>
    </Link>
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
    backgroundColor: AC.tertiarySystemBackground,
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
    gap: 12,
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
    color: AC.label,
  },
  feedItemContent: {
    fontSize: 16,
    color: AC.label,
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
    color: AC.secondaryLabel,
  },
  feedFavicon: {
    width: 24,
    height: 24,
  },
});
