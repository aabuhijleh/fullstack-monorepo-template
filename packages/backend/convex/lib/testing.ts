import { type Id, type TableNames } from "@workspace/backend/dataModel";

/**
 * Helper for tests: creates a nominally-typed Convex `Id<Table>` from a string.
 *
 * Convex IDs are opaque types tagged with the table name for type safety.
 * This function lets you mock or construct IDs in test code without real Convex objects.
 *
 * @param value - The string representation of the id (usually from an objectId).
 * @returns The value, typed as `Id<Table>`.
 *
 * Example:
 *   const userId = id<"users">("42")  // userId: Id<"users">
 */
export function id<Table extends TableNames>(value: string): Id<Table> {
  // eslint-disable-next-line typescript-eslint/no-unsafe-type-assertion
  return value as Id<Table>;
}
