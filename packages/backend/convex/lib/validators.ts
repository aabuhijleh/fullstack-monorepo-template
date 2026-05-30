import { ConvexError } from "convex/values";
import { z } from "zod";

/** Shared Zod v4 schema for task text. Used on clients and re-checked server-side. */
export const taskTextSchema = z.string().trim().min(1).max(256);

/** Validates and normalizes task text, throwing ConvexError on failure. */
export function parseTaskText(text: string): string {
  const result = taskTextSchema.safeParse(text);
  if (!result.success) {
    throw new ConvexError("Task text must be 1–256 characters");
  }
  return result.data;
}
