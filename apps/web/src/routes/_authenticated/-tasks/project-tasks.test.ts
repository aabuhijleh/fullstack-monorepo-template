import { type Doc } from "@workspace/backend/dataModel";
import { id } from "@workspace/backend/testing";
import { expect, test } from "vitest";

import { projectTasks } from "./project-tasks";

const activeTask = {
  _id: id<"tasks">("active"),
  _creationTime: 1,
  userId: id<"users">("user"),
  text: "active task",
  isCompleted: false,
} as Doc<"tasks">;

const completedTask = {
  ...activeTask,
  _id: id<"tasks">("completed"),
  text: "completed task",
  isCompleted: true,
} as Doc<"tasks">;

test("projects pending mutation variables without changing source tasks", () => {
  const tasks = [activeTask, completedTask];

  const projected = projectTasks(tasks, {
    additions: [{ text: "new task", submittedAt: 10 }],
    toggles: [{ taskId: activeTask._id }],
    updates: [{ taskId: completedTask._id, text: "renamed task" }],
    removals: [],
    isClearingCompleted: false,
  });

  expect(projected).toEqual([
    {
      key: "pending-10",
      text: "new task",
      isCompleted: false,
      isPending: true,
    },
    {
      key: activeTask._id,
      taskId: activeTask._id,
      text: "active task",
      isCompleted: true,
      isPending: true,
    },
    {
      key: completedTask._id,
      taskId: completedTask._id,
      text: "renamed task",
      isCompleted: true,
      isPending: true,
    },
  ]);
  expect(tasks).toEqual([activeTask, completedTask]);
});

test("hides pending removals and completed tasks while clearing", () => {
  const projected = projectTasks([activeTask, completedTask], {
    additions: [],
    toggles: [],
    updates: [],
    removals: [{ taskId: activeTask._id }],
    isClearingCompleted: true,
  });

  expect(projected).toEqual([]);
});
