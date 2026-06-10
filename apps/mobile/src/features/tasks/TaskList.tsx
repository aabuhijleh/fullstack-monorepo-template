import { type Id } from "@workspace/backend/dataModel";
import { FlatList } from "react-native";

import { type ProjectedTask } from "./project-tasks";
import { TaskRow } from "./TaskRow";

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
      contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
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
