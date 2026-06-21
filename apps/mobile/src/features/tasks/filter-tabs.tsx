import { Pressable, Text, View } from "react-native";

export type TaskFilter = "all" | "active" | "completed";
const FILTERS: Array<{ key: TaskFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export function FilterTabs({
  value,
  onChange,
}: {
  value: TaskFilter;
  onChange: (v: TaskFilter) => void;
}) {
  return (
    <View className="flex-1 flex-row gap-1 bg-muted p-1">
      {FILTERS.map((f) => (
        <Pressable
          key={f.key}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === f.key }}
          onPress={() => onChange(f.key)}
          className={`flex-1 items-center px-3 py-1.5 ${value === f.key ? "bg-background" : ""}`}
        >
          <Text
            className={`font-sans text-sm ${value === f.key ? "text-foreground" : "text-muted-foreground"}`}
          >
            {f.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
