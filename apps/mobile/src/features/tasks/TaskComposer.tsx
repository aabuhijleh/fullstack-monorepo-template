import { useForm } from "@tanstack/react-form";
import { taskTextValidator } from "@workspace/backend/validators";
import { Plus as LucidePlus } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";
import { withUniwind } from "uniwind";

const Plus = withUniwind(LucidePlus);

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
            placeholderTextColorClassName="accent-muted-foreground"
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            onSubmitEditing={() => void form.handleSubmit()}
            returnKeyType="done"
            className="flex-1 rounded-lg border border-border px-3 py-2 text-base text-foreground"
          />
        )}
      </form.Field>
      <Pressable
        accessibilityLabel="Add task"
        onPress={() => void form.handleSubmit()}
        className="size-10 items-center justify-center rounded-lg bg-primary"
      >
        <Plus size={20} colorClassName="accent-primary-foreground" />
      </Pressable>
    </View>
  );
}
