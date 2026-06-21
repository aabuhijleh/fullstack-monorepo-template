import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { TaskComposer } from "./task-composer";

test("submits trimmed text", async () => {
  const onAdd = jest.fn().mockResolvedValue(undefined);
  render(<TaskComposer onAdd={onAdd} />);
  const input = screen.getByPlaceholderText("Add a task");
  fireEvent.changeText(input, "  walk dog  ");
  // The composer submits on the keyboard return key, not a button.
  fireEvent(input, "submitEditing");
  // TanStack Form's onSubmit is async, so the call lands on a later microtask.
  await waitFor(() => expect(onAdd).toHaveBeenCalledWith("walk dog"));
});
