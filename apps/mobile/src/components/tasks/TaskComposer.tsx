import { useForm } from "@tanstack/react-form";
import { taskTextValidator } from "@workspace/backend/validators";
import { Plus } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

export function TaskComposer({ onAdd }: { onAdd: (text: string) => Promise<unknown> }) {
  const form = useForm({
    defaultValues: { text: "" },
    validators: {
      onSubmit: taskTextValidator,
    },
    onSubmit: async ({ value, formApi }) => {
      await onAdd(value.text.trim());
      formApi.reset();
    },
  });

  return (
    <View className="flex-row items-center gap-2">
      <form.Field name="text">
        {(field) => (
          <TextInput
            placeholder="Add a task…"
            placeholderTextColor="#9ca3af"
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            onSubmitEditing={() => void form.handleSubmit()}
            returnKeyType="done"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-900 dark:border-gray-700 dark:text-gray-100"
          />
        )}
      </form.Field>
      <Pressable
        accessibilityLabel="Add task"
        onPress={() => void form.handleSubmit()}
        className="h-10 w-10 items-center justify-center rounded-lg bg-blue-600"
      >
        <Plus size={20} color="white" />
      </Pressable>
    </View>
  );
}
