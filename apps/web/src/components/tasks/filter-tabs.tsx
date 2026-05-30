import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

export type TaskFilter = "all" | "active" | "completed";

export function FilterTabs({
  value,
  onChange,
}: {
  value: TaskFilter;
  onChange: (v: TaskFilter) => void;
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TaskFilter)}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
