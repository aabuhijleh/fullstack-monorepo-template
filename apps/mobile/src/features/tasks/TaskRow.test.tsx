import { fireEvent, render, screen } from "@testing-library/react-native";
import { id } from "@workspace/backend/testing";

import { TaskRow } from "./TaskRow";

const task = {
  key: "t1",
  taskId: id<"tasks">("t1"),
  text: "buy milk",
  isCompleted: false,
  isPending: false,
};

test("fires onToggle and onRemove", () => {
  const onToggle = jest.fn();
  const onRemove = jest.fn();
  render(<TaskRow task={task} onToggle={onToggle} onUpdate={jest.fn()} onRemove={onRemove} />);
  fireEvent.press(screen.getByLabelText("Toggle complete"));
  fireEvent.press(screen.getByLabelText("Delete task"));
  expect(onToggle).toHaveBeenCalled();
  expect(onRemove).toHaveBeenCalled();
});
