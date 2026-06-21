import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useForm } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@workspace/backend/api";
import { type Doc } from "@workspace/backend/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { Field } from "@workspace/ui/components/field";
import { Label } from "@workspace/ui/components/label";
import { ClipboardListIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";

export function TasksPage() {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list));

  return <TaskList tasks={tasks} />;
}

type TaskListProps = {
  tasks: Array<Doc<"tasks">>;
};

function TaskList({ tasks }: TaskListProps) {
  return (
    <div>
      <TaskComposer />

      {tasks.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardListIcon />
            </EmptyMedia>
            <EmptyTitle>No tasks yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t added any tasks yet. Get started by adding your first task.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button> Add task</Button>
          </EmptyContent>
        </Empty>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
}

const taskSchema = z.object({
  text: z.string().min(1),
});

function TaskComposer() {
  const addMutation = useMutation({ mutationFn: useConvexMutation(api.tasks.add) });

  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onSubmit: taskSchema,
    },
    onSubmit: ({ value }) => {
      addMutation.mutate({ text: value.text });
    },
  });

  return (
    <form
      id="task-composer-form"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      {/* ... */}
    </form>
  );
}

type TaskItemProps = {
  task: Doc<"tasks">;
};

function TaskItem({ task }: TaskItemProps) {
  const toggleMutation = useMutation({ mutationFn: useConvexMutation(api.tasks.toggle) });
  const removeMutation = useMutation({ mutationFn: useConvexMutation(api.tasks.remove) });

  return (
    <li>
      <Field orientation="horizontal">
        <Checkbox
          id={task._id}
          checked={task.isCompleted}
          onCheckedChange={() => toggleMutation.mutate({ taskId: task._id })}
        />
        <Label htmlFor={task._id} className="text-base">
          {task.text}
        </Label>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => removeMutation.mutate({ taskId: task._id })}
        >
          <span className="sr-only">Remove task</span>
          <Trash2Icon />
        </Button>
      </Field>
    </li>
  );
}
