import { NewEntry } from "@/db/schema";
import { XMLParser } from "fast-xml-parser";

export class RssService {
  public async fetchFeeds(
    feeds: { id: string; url: string }[]
  ): Promise<NewEntry[]> {
    const newEntries: NewEntry[] = [];
    const parser = new XMLParser({ ignoreAttributes: false });

    for (const feed of feeds) {
      const response = await fetch(feed.url, {
        headers: {
          "User-Agent": "panelist-rss-fetcher/1.0",
          Accept: "application/rss+xml, application/atom+xml, text/xml",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
        );
      }

      const xmlText = await response.text();
      const parsed = parser.parse(xmlText);

      // Normalize RSS vs Atom format
      const channel = parsed?.rss?.channel ?? parsed?.feed;
      if (!channel) continue;

      const items = channel.item ?? channel.entry ?? [];
      const normalizedItems = Array.isArray(items) ? items : [items];

      for (const item of normalizedItems) {
        // rss: title/link/pubDate/content
        // atom: title/link["@_href"]/updated/summary/content
        const link = item.link?.["@_href"] ?? item.link ?? ""; // atom link or rss link
        const pubDate = item.pubDate ?? item.updated ?? item.published ?? null;
        const content =
          item["content:encoded"] ??
          item.content?.["#text"] ??
          item.content ??
          item.summary ??
          "";

        const isDescriptionHtml =
          typeof content === "string" && content.includes("<");

        const newEntry: NewEntry = {
          feedId: feed.id,
          link,
          guid: item.guid ?? item.id ?? link, // fallback to link if no guid
          title: item.title?.["#text"] ?? item.title ?? "",
          pubDate: pubDate ? new Date(pubDate) : null,
          author: item.creator ?? item.author?.name ?? null,
          description: content,
          isDescriptionHtml,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        newEntries.push(newEntry);
      }
    }

    return newEntries;
  }
}
