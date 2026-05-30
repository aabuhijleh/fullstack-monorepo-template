import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Doc } from "@workspace/backend/dataModel";
import { expect, test, vi } from "vitest";

import { TaskRow } from "./task-row";

// Branded Convex `Id`/`_creationTime` fields have no runtime constructor, so a
// fixture for `Doc<"tasks">` is necessarily cast.
// eslint-disable-next-line typescript-eslint/no-unsafe-type-assertion
const task = {
  _id: "t1",
  _creationTime: 0,
  userId: "u1",
  text: "buy milk",
  isCompleted: false,
} as unknown as Doc<"tasks">;

test("calls onToggle when checkbox clicked", async () => {
  const onToggle = vi.fn();
  render(<TaskRow task={task} onToggle={onToggle} onUpdate={vi.fn()} onRemove={vi.fn()} />);
  await userEvent.click(screen.getByRole("checkbox"));
  expect(onToggle).toHaveBeenCalled();
});

test("calls onRemove when delete clicked", async () => {
  const onRemove = vi.fn();
  render(<TaskRow task={task} onToggle={vi.fn()} onUpdate={vi.fn()} onRemove={onRemove} />);
  await userEvent.click(screen.getByRole("button", { name: /delete/i }));
  expect(onRemove).toHaveBeenCalled();
});

test("edits text on double-click and saves on blur", async () => {
  const onUpdate = vi.fn();
  render(<TaskRow task={task} onToggle={vi.fn()} onUpdate={onUpdate} onRemove={vi.fn()} />);
  await userEvent.dblClick(screen.getByText("buy milk"));
  const input = screen.getByRole("textbox");
  await userEvent.clear(input);
  await userEvent.type(input, "buy bread");
  await userEvent.tab();
  expect(onUpdate).toHaveBeenCalledWith("buy bread");
});
