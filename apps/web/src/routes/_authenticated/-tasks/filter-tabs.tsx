import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

export type TaskFilter = "all" | "active" | "completed";

function isTaskFilter(v: string): v is TaskFilter {
  return v === "all" || v === "active" || v === "completed";
}

export function FilterTabs({
  value,
  onChange,
}: {
  value: TaskFilter;
  onChange: (v: TaskFilter) => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => {
        if (isTaskFilter(v)) onChange(v);
      }}
    >
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
