import { z } from "zod";

export const locationUpdateSchema = z.object({
  journeyId: z.number().int().positive(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
});

export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;