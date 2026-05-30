import { fireEvent, render, screen } from "@testing-library/react-native";

import { TaskRow } from "~/components/tasks/TaskRow";

const task = {
  _id: "t1",
  _creationTime: 0,
  userId: "u1",
  text: "buy milk",
  isCompleted: false,
} as never;

test("fires onToggle and onRemove", () => {
  const onToggle = jest.fn();
  const onRemove = jest.fn();
  render(<TaskRow task={task} onToggle={onToggle} onUpdate={jest.fn()} onRemove={onRemove} />);
  fireEvent.press(screen.getByLabelText("Toggle complete"));
  fireEvent.press(screen.getByLabelText("Delete task"));
  expect(onToggle).toHaveBeenCalled();
  expect(onRemove).toHaveBeenCalled();
});
