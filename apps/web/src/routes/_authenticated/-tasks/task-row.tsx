import { useForm } from "@tanstack/react-form";
import { taskTextValidator } from "@workspace/backend/validators";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { type ProjectedTask } from "./project-tasks";

type Props = {
  task: ProjectedTask;
  onToggle: () => void;
  onUpdate: (text: string) => void;
  onRemove: () => void;
};

export function TaskRow({ task, onToggle, onUpdate, onRemove }: Props) {
  const [editing, setEditing] = useState(false);

  // Inline edit uses TanStack Form (all text inputs go through it).
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
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2",
        task.isPending && "opacity-60",
      )}
    >
      <Checkbox
        checked={task.isCompleted}
        onCheckedChange={onToggle}
        aria-label="Toggle complete"
        disabled={!task.taskId || task.isPending}
      />
      {editing ? (
        <form.Field name="text">
          {(field) => (
            <Input
              autoFocus
              aria-label="Edit task"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => void form.handleSubmit()}
              onKeyDown={(e) => {
                if (e.key === "Enter") void form.handleSubmit();
                if (e.key === "Escape") {
                  field.handleChange(task.text);
                  setEditing(false);
                }
              }}
              className="flex-1"
            />
          )}
        </form.Field>
      ) : (
        <span
          className={cn("flex-1", task.isCompleted && "text-muted-foreground line-through")}
          onDoubleClick={startEditing}
        >
          {task.text}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete task"
        onClick={onRemove}
        disabled={!task.taskId || task.isPending}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
