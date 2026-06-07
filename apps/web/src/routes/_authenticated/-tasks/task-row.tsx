import { useForm } from "@tanstack/react-form";
import { type Doc } from "@workspace/backend/dataModel";
import { taskTextValidator } from "@workspace/backend/validators";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  task: Doc<"tasks">;
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
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
      <Checkbox
        checked={task.isCompleted}
        onCheckedChange={onToggle}
        aria-label="Toggle complete"
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
          className={`flex-1 ${task.isCompleted ? "text-muted-foreground line-through" : ""}`}
          onDoubleClick={startEditing}
        >
          {task.text}
        </span>
      )}
      <Button variant="ghost" size="icon-sm" aria-label="Delete task" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
