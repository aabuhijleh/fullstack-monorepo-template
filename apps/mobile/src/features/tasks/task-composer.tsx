import { useForm } from "@tanstack/react-form";
import { taskTextValidator } from "@workspace/backend/validators";
import { Plus as LucidePlus } from "lucide-react-native";
import { TextInput, View } from "react-native";
import { withUniwind } from "uniwind";

const Plus = withUniwind(LucidePlus);

type TaskComposerProps = {
  onAdd: (text: string) => Promise<unknown>;
  placeholder?: string;
};

export function TaskComposer({ onAdd, placeholder = "Add a task" }: TaskComposerProps) {
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
    <View className="flex-row items-center gap-3 border-b border-foreground/20">
      <Plus size={20} colorClassName="accent-muted-foreground" />
      <form.Field name="text">
        {(field) => (
          <TextInput
            placeholder={placeholder}
            placeholderTextColorClassName="accent-muted-foreground"
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            onSubmitEditing={() => void form.handleSubmit()}
            returnKeyType="done"
            className="h-11 flex-1 font-sans text-base tracking-normal text-foreground"
          />
        )}
      </form.Field>
    </View>
  );
}
