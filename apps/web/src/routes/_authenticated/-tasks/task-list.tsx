import { type Doc } from "@workspace/backend/dataModel";

import { TaskRow } from "./task-row";

type Props = {
  tasks: Doc<"tasks">[];
  onToggle: (id: Doc<"tasks">["_id"]) => void;
  onUpdate: (id: Doc<"tasks">["_id"], text: string) => void;
  onRemove: (id: Doc<"tasks">["_id"]) => void;
};

export function TaskList({ tasks, onToggle, onUpdate, onRemove }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskRow
          key={task._id}
          task={task}
          onToggle={() => onToggle(task._id)}
          onUpdate={(text) => onUpdate(task._id, text)}
          onRemove={() => onRemove(task._id)}
        />
      ))}
    </div>
  );
}
