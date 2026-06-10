import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { TaskComposer } from "./TaskComposer";

test("submits trimmed text", async () => {
  const onAdd = jest.fn().mockResolvedValue(undefined);
  render(<TaskComposer onAdd={onAdd} />);
  fireEvent.changeText(screen.getByPlaceholderText("Add a task…"), "  walk dog  ");
  fireEvent.press(screen.getByLabelText("Add task"));
  // TanStack Form's onSubmit is async, so the call lands on a later microtask.
  await waitFor(() => expect(onAdd).toHaveBeenCalledWith("walk dog"));
});
