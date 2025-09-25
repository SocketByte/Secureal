import { z } from "zod"

export const appIpcSchema = {
  version: {
    args: z.tuple([]),
    return: z.string(),
  },
  pingServer: {
    args: z.tuple([z.string()]), // hostname or IP
    return: z.object({
      alive: z.boolean(),
      time: z.number().nullable().optional(),
      error: z.string().optional(),
    }),
  },
}
