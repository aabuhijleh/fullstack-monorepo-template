import { type Id } from "@workspace/backend/dataModel";
import { FlatList } from "react-native";

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
    <FlatList
      data={tasks}
      keyExtractor={(task) => task.key}
      contentContainerStyle={{ paddingVertical: 4 }}
      renderItem={({ item }) => (
        <TaskRow
          task={item}
          onToggle={() => item.taskId && onToggle(item.taskId)}
          onUpdate={(text) => item.taskId && onUpdate(item.taskId, text)}
          onRemove={() => item.taskId && onRemove(item.taskId)}
        />
      )}
    />
  );
}
