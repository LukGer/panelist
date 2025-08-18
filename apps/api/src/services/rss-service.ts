import { NewEntry } from "@/db/schema";
import RssParser from "rss-parser";

export class RssService {
  private readonly _parser: RssParser;

  public constructor() {
    this._parser = new RssParser();
  }

  public async fetchFeeds(
    feeds: { id: string; url: string }[]
  ): Promise<NewEntry[]> {
    const newEntries: NewEntry[] = [];

    for (const feed of feeds) {
      const result = await this._parser.parseURL(feed.url);

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
