import { useForm } from "@tanstack/react-form";
import type { Doc } from "@workspace/backend/dataModel";
import { taskTextSchema } from "@workspace/backend/validators";
import { Check, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  task: Doc<"tasks">;
  onToggle: () => void;
  onUpdate: (text: string) => void;
  onRemove: () => void;
};

export function TaskRow({ task, onToggle, onUpdate, onRemove }: Props) {
  const [editing, setEditing] = useState(false);

  const form = useForm({
    defaultValues: { text: task.text },
    onSubmit: ({ value }) => {
      const trimmed = value.text.trim();
      setEditing(false);
      if (taskTextSchema.safeParse(trimmed).success && trimmed !== task.text) onUpdate(trimmed);
    },
  });

  function startEditing() {
    form.setFieldValue("text", task.text);
    setEditing(true);
  }

  return (
    <View className="flex-row items-center gap-3 rounded-lg border border-gray-200 px-3 py-3 dark:border-gray-700">
      <Pressable
        accessibilityLabel="Toggle complete"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.isCompleted }}
        onPress={onToggle}
        className="h-6 w-6 items-center justify-center rounded border border-gray-400 dark:border-gray-500"
      >
        {task.isCompleted ? <Check size={16} color="#16a34a" /> : null}
      </Pressable>
      {editing ? (
        <form.Field name="text">
          {(field) => (
            <TextInput
              autoFocus
              accessibilityLabel="Edit task"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={() => void form.handleSubmit()}
              onSubmitEditing={() => void form.handleSubmit()}
              className="flex-1 text-base text-gray-900 dark:text-gray-100"
            />
          )}
        </form.Field>
      ) : (
        <Text
          onPress={startEditing}
          className={`flex-1 text-base ${task.isCompleted ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
        >
          {task.text}
        </Text>
      )}
      <Pressable accessibilityLabel="Delete task" onPress={onRemove} hitSlop={8}>
        <Trash2 size={18} color="#ef4444" />
      </Pressable>
    </View>
  );
}
