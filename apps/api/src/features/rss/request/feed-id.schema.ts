import { z } from "zod";

export const FeedIdRequestParamsSchema = z.object({
  feedId: z.uuid(),
});
