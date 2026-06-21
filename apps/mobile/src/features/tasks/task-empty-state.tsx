import { ListTodo as LucideListTodo, Plus as LucidePlus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const ListTodo = withUniwind(LucideListTodo);
const Plus = withUniwind(LucidePlus);

const SUGGESTIONS = ["Plan the week ahead", "Reply to outstanding emails", "Block focus time"];

export function TaskEmptyState({ onAdd }: { onAdd: (text: string) => void }) {
  return (
    <View className="items-center gap-6 py-8">
      <View className="size-12 items-center justify-center bg-muted">
        <ListTodo size={24} colorClassName="accent-muted-foreground" />
      </View>
      <View className="items-center gap-1.5">
        <Text className="font-heading text-lg text-foreground">Your list is empty</Text>
        <Text className="max-w-xs text-center font-sans text-sm text-muted-foreground">
          Add a task above, or start with one of these to get the ball rolling.
        </Text>
      </View>
      <View className="w-full gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <Pressable
            key={suggestion}
            onPress={() => onAdd(suggestion)}
            className="flex-row items-center justify-center gap-1.5 border border-border bg-background px-2.5 py-2 active:bg-muted"
          >
            <Plus size={14} colorClassName="accent-muted-foreground" />
            <Text className="font-sans text-sm text-muted-foreground">{suggestion}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
