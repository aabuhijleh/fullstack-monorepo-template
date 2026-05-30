import { fireEvent, render, screen } from "@testing-library/react-native";
import type { Doc } from "@workspace/backend/dataModel";

import { TaskRow } from "~/components/tasks/TaskRow";

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

test("fires onToggle and onRemove", () => {
  const onToggle = jest.fn();
  const onRemove = jest.fn();
  render(<TaskRow task={task} onToggle={onToggle} onUpdate={jest.fn()} onRemove={onRemove} />);
  fireEvent.press(screen.getByLabelText("Toggle complete"));
  fireEvent.press(screen.getByLabelText("Delete task"));
  expect(onToggle).toHaveBeenCalled();
  expect(onRemove).toHaveBeenCalled();
});
