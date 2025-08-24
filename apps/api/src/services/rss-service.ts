import { NewEntry } from "@/db/schema";
import RssParser from "rss-parser";

export class RssService {
  public async fetchFeeds(
    feeds: { id: string; url: string }[]
  ): Promise<NewEntry[]> {
    const newEntries: NewEntry[] = [];

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
      const parser = new RssParser();
      const result = await parser.parseString(xmlText);

      for (const item of result.items) {
        const isDescriptionHtml = item.content?.includes("<");

        const newEntry: NewEntry = {
          feedId: feed.id,
          link: item.link ?? "",
          guid: item.guid ?? "",
          title: item.title ?? "",
          pubDate: item.pubDate ? new Date(item.pubDate) : null,
          author: item.creator,
          description: item.content,
          isDescriptionHtml: isDescriptionHtml,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        newEntries.push(newEntry);
      }
    }

    return newEntries;
  }
}
