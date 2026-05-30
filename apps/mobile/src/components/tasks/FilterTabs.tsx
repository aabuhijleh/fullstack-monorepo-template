import { Pressable, Text, View } from "react-native";

export type TaskFilter = "all" | "active" | "completed";
const FILTERS: { key: TaskFilter; label: string }[] = [
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
    <View className="flex-row gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      {FILTERS.map((f) => (
        <Pressable
          key={f.key}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === f.key }}
          onPress={() => onChange(f.key)}
          className={`flex-1 items-center rounded-md px-3 py-1.5 ${value === f.key ? "bg-white dark:bg-gray-700" : ""}`}
        >
          <Text
            className={`text-sm ${value === f.key ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}
          >
            {f.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
