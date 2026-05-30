import type { Id, TableNames } from "../_generated/dataModel";

export function id<Table extends TableNames>(value: string): Id<Table> {
  // eslint-disable-next-line typescript-eslint/no-unsafe-type-assertion
  return value as Id<Table>;
}
