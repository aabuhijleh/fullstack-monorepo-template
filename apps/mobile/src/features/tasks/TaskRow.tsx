import { useForm } from "@tanstack/react-form";
import { taskTextValidator } from "@workspace/backend/validators";
import { Check, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { type ProjectedTask } from "./project-tasks";

type Props = {
  task: ProjectedTask;
  onToggle: () => void;
  onUpdate: (text: string) => void;
  onRemove: () => void;
};

export function TaskRow({ task, onToggle, onUpdate, onRemove }: Props) {
  const [editing, setEditing] = useState(false);

  const form = useForm({
    defaultValues: { text: task.text },
    validators: {
      onSubmit: taskTextValidator,
    },
    onSubmit: ({ value }) => {
      const trimmed = value.text.trim();
      setEditing(false);
      if (trimmed !== task.text) onUpdate(trimmed);
    },
  });

  function startEditing() {
    form.setFieldValue("text", task.text);
    setEditing(true);
  }

  return (
    <View
      className="flex-row items-center gap-3 rounded-lg border border-border px-3 py-3"
      style={{ opacity: task.isPending ? 0.6 : 1 }}
    >
      <Pressable
        accessibilityLabel="Toggle complete"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.isCompleted }}
        onPress={onToggle}
        disabled={!task.taskId || task.isPending}
        className="size-6 items-center justify-center rounded border border-border"
      >
        {task.isCompleted ? <Check size={16} color="#737373" /> : null}
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
              editable={!task.isPending}
              className="flex-1 text-base text-foreground"
            />
          )}
        </form.Field>
      ) : (
        <Text
          onPress={startEditing}
          className={`flex-1 text-base ${task.isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}
        >
          {task.text}
        </Text>
      )}
      <Pressable
        accessibilityLabel="Delete task"
        onPress={onRemove}
        hitSlop={8}
        disabled={!task.taskId || task.isPending}
      >
        <Trash2 size={18} color="#ef4444" />
      </Pressable>
    </View>
  );
}
