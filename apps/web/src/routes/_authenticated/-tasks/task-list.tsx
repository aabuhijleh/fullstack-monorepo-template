import { type Id } from "@workspace/backend/dataModel";

import { type ProjectedTask } from "./project-tasks";
import { TaskRow } from "./task-row";

type Props = {
  tasks: Array<ProjectedTask>;
  onToggle: (id: Id<"tasks">) => void;
  onUpdate: (id: Id<"tasks">, text: string) => void;
  onRemove: (id: Id<"tasks">) => void;
};

export function TaskList({ tasks, onToggle, onUpdate, onRemove }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskRow
          key={task.key}
          task={task}
          onToggle={() => task.taskId && onToggle(task.taskId)}
          onUpdate={(text) => task.taskId && onUpdate(task.taskId, text)}
          onRemove={() => task.taskId && onRemove(task.taskId)}
        />
      ))}
    </div>
  );
}
