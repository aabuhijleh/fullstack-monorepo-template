import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { TaskComposer } from "./task-composer";

test("submits trimmed text and clears the input", async () => {
  const onAdd = vi.fn().mockResolvedValue(undefined);
  render(<TaskComposer onAdd={onAdd} />);
  const input = screen.getByPlaceholderText("Add a task…");
  await userEvent.type(input, "  walk dog  ");
  await userEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(onAdd).toHaveBeenCalledWith("walk dog");
  expect(input).toHaveValue("");
});

test("does not submit blank text", async () => {
  const onAdd = vi.fn();
  render(<TaskComposer onAdd={onAdd} />);
  await userEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(onAdd).not.toHaveBeenCalled();
});
