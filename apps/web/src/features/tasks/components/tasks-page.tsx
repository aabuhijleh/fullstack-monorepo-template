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
import { Field, FieldError, FieldGroup } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Spinner } from "@workspace/ui/components/spinner";
import { ClipboardListIcon, PlusIcon, Trash2Icon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

export function TasksPage() {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list));

  return <TaskList tasks={tasks} />;
}

type TaskListProps = {
  tasks: Array<Doc<"tasks">>;
};

function TaskList({ tasks }: TaskListProps) {
  const taskComposerRef = React.useRef<TaskComposerRef>(null);

  const handleAddTask = () => {
    taskComposerRef.current?.focus();
  };

  return (
    <div>
      <TaskComposer ref={taskComposerRef} />

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
            <Button onClick={handleAddTask}> Add task</Button>
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

type TaskComposerRef = {
  focus: () => void;
};

type TaskComposerProps = {
  ref: React.RefObject<TaskComposerRef | null>;
};

function TaskComposer({ ref }: TaskComposerProps) {
  const addMutation = useMutation({ mutationFn: useConvexMutation(api.tasks.add) });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onSubmit: taskSchema,
    },
    onSubmit: ({ value }) => {
      addMutation.mutate({ text: value.text });
      form.reset();
    },
  });

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  return (
    <form
      id="task-composer-form"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup className="flex-row items-center gap-2">
        <form.Field name="text">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <Input
                  ref={inputRef}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Implement a new feature"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <Button size="icon" type="submit" disabled={addMutation.isPending}>
          {addMutation.isPending ? <Spinner /> : <PlusIcon />}
        </Button>
      </FieldGroup>
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
