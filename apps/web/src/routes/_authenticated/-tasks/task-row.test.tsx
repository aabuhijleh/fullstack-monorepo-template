import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { id } from "@workspace/backend/testing";
import { expect, test, vi } from "vitest";

import { TaskRow } from "./task-row";

const task = {
  key: "t1",
  taskId: id<"tasks">("t1"),
  text: "buy milk",
  isCompleted: false,
  isPending: false,
};

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
