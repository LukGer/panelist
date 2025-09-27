import { z } from "zod";

export const EntryIdRequestParamsSchema = z.object({
  entryId: z.uuid(),
});
