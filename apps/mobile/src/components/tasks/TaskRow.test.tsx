import { fireEvent, render, screen } from "@testing-library/react-native";
import { Doc } from "@workspace/backend/dataModel";
import { id } from "@workspace/backend/testing";

import { TaskRow } from "~/components/tasks/TaskRow";

const task = {
  _id: id<"tasks">("t1"),
  _creationTime: 0,
  userId: id<"users">("u1"),
  text: "buy milk",
  isCompleted: false,
} as Doc<"tasks">;

test("fires onToggle and onRemove", () => {
  const onToggle = jest.fn();
  const onRemove = jest.fn();
  render(<TaskRow task={task} onToggle={onToggle} onUpdate={jest.fn()} onRemove={onRemove} />);
  fireEvent.press(screen.getByLabelText("Toggle complete"));
  fireEvent.press(screen.getByLabelText("Delete task"));
  expect(onToggle).toHaveBeenCalled();
  expect(onRemove).toHaveBeenCalled();
});
