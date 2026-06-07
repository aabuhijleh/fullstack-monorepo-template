import { type Doc } from "@workspace/backend/dataModel";
import { FlatList } from "react-native";

import { TaskRow } from "./TaskRow";

type Props = {
  tasks: Doc<"tasks">[];
  onToggle: (id: Doc<"tasks">["_id"]) => void;
  onUpdate: (id: Doc<"tasks">["_id"], text: string) => void;
  onRemove: (id: Doc<"tasks">["_id"]) => void;
};

export function TaskList({ tasks, onToggle, onUpdate, onRemove }: Props) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(t) => t._id}
      contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
      renderItem={({ item }) => (
        <TaskRow
          task={item}
          onToggle={() => onToggle(item._id)}
          onUpdate={(text) => onUpdate(item._id, text)}
          onRemove={() => onRemove(item._id)}
        />
      )}
    />
  );
}
