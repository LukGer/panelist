import { useThemeColor } from "@/hooks/useThemeColor";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Dummy data for now - replace with API call later
const dummyEntry = {
  id: "1",
  title: "Sample Article Title",
  description:
    "This is a sample article description. In a real implementation, this would be fetched from the API based on the entryId parameter.",
  content:
    "This is the full content of the article. It would contain the complete article text, images, and formatting. For now, this is just dummy content to demonstrate the layout and structure of the entry details page.",
  author: "John Doe",
  pubDate: new Date("2024-01-15"),
  link: "https://example.com/article",
  feed: {
    id: "1",
    title: "Sample Feed",
    faviconUrl: null,
    siteUrl: "https://example.com",
  },
};

export default function EntryDetailsScreen() {
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "primary");

  const handleOpenInBrowser = async () => {
    await WebBrowser.openBrowserAsync(dummyEntry.link);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Article",
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Article Header */}
        <View style={styles.header}>
          <Link
            href={{
              pathname: "/feed/[feedId]",
              params: { feedId: dummyEntry.feed.id },
            }}
            asChild
          >
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.feedInfo}>
                {dummyEntry.feed.faviconUrl && (
                  <Image
                    source={dummyEntry.feed.faviconUrl}
                    style={styles.favicon}
                  />
                )}
                <View style={styles.titleSection}>
                  <Text style={styles.source}>{dummyEntry.feed.title}</Text>
                  <Text style={styles.date}>
                    {dummyEntry.pubDate.toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          <Text style={styles.title}>{dummyEntry.title}</Text>

          {dummyEntry.author && (
            <Text style={styles.author}>By {dummyEntry.author}</Text>
          )}
        </View>

        {/* Article Content */}
        <View style={styles.content}>
          {dummyEntry.description && (
            <Text style={styles.description}>{dummyEntry.description}</Text>
          )}

          <Text style={styles.body}>{dummyEntry.content}</Text>
        </View>
      </ScrollView>
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
});
