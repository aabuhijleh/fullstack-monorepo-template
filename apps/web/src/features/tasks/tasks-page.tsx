import { type Doc } from "@workspace/backend/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Spinner } from "@workspace/ui/components/spinner";
import { cn } from "@workspace/ui/lib/utils";
import { ListTodoIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import * as React from "react";

import { type TaskBoardProps, useTasks } from "./use-tasks";

const SUGGESTIONS = [
  "Plan the week ahead",
  "Reply to outstanding emails",
  "Review open pull requests",
  "Block focus time",
];

export function TasksPage() {
  const board = useTasks();

  return (
    <section className="space-y-8">
      <TaskComposer
        onAdd={board.onAdd}
        isAdding={board.isAdding}
        placeholder={
          board.total === 0 ? "What's the first thing on your mind?" : "Add a task and press Enter"
        }
      />

      {board.total === 0 ? <EmptyState onAdd={board.onAdd} /> : <TaskSections board={board} />}
    </section>
  );
}

/** Borderless underline composer. Manages its own input state. */
function TaskComposer({
  onAdd,
  isAdding,
  placeholder,
}: {
  onAdd: (text: string) => void;
  isAdding?: boolean;
  placeholder: string;
}) {
  const [text, setText] = React.useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAdd(value);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-3">
      <PlusIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Add a task"
        className="h-11 flex-1 rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 !text-base shadow-none transition-colors focus-visible:border-foreground focus-visible:ring-0 dark:bg-transparent"
      />
      {isAdding ? <Spinner className="size-4 text-muted-foreground" /> : null}
    </form>
  );
}

/** Onboarding empty state — quick-start suggestions seed the list in one tap. */
function EmptyState({ onAdd }: { onAdd: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
        <ListTodoIcon className="size-6" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-heading text-lg font-semibold">Your list is empty</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Add a task above, or start with one of these to get the ball rolling.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onAdd(suggestion)}
          >
            <PlusIcon />
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

function TaskSections({ board }: { board: TaskBoardProps }) {
  const activeTasks = board.tasks.filter((task) => !task.isCompleted);
  const doneTasks = board.tasks.filter((task) => task.isCompleted);

  return (
    <div className="space-y-8">
      <TaskSection label="Active" count={board.active}>
        {activeTasks.length === 0 ? (
          <p className="py-3 text-sm text-muted-foreground">Inbox zero. Everything is done.</p>
        ) : (
          activeTasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onToggle={board.onToggle}
              onUpdate={board.onUpdate}
              onRemove={board.onRemove}
            />
          ))
        )}
      </TaskSection>

      {doneTasks.length > 0 && (
        <TaskSection
          label="Completed"
          count={board.completed}
          action={
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
              disabled={board.isClearing}
              onClick={board.onClearCompleted}
            >
              Clear
            </Button>
          }
        >
          {doneTasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onToggle={board.onToggle}
              onUpdate={board.onUpdate}
              onRemove={board.onRemove}
            />
          ))}
        </TaskSection>
      )}
    </div>
  );
}

type TaskSectionProps = React.PropsWithChildren<{
  label: string;
  count: number;
  action?: React.ReactNode;
}>;

function TaskSection({ label, count, action, children }: TaskSectionProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
        </div>
        {action}
      </div>
      <Separator />
      <div>{children}</div>
    </div>
  );
}

type TaskRowProps = {
  task: Doc<"tasks">;
  onToggle: (taskId: Doc<"tasks">["_id"]) => void;
  onUpdate: (taskId: Doc<"tasks">["_id"], text: string) => void;
  onRemove: (taskId: Doc<"tasks">["_id"]) => void;
};

function TaskRow({ task, onToggle, onUpdate, onRemove }: TaskRowProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(task.text);

  const startEditing = () => {
    setDraft(task.text);
    setIsEditing(true);
  };

  const commit = () => {
    const value = draft.trim();
    setIsEditing(false);
    if (!value || value === task.text) return;
    onUpdate(task._id, value);
  };

  const cancel = () => {
    setDraft(task.text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="group flex items-center gap-3 py-2.5">
        <Checkbox id={task._id} checked={task.isCompleted} disabled />
        <Input
          autoFocus
          value={draft}
          maxLength={50}
          aria-label="Edit task"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            } else if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          className="h-7 flex-1 rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 !text-sm shadow-none transition-colors focus-visible:border-foreground focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 py-2.5">
      <Checkbox
        id={task._id}
        checked={task.isCompleted}
        onCheckedChange={() => onToggle(task._id)}
      />
      <label
        htmlFor={task._id}
        className={cn(
          "flex-1 cursor-pointer text-sm transition-colors",
          task.isCompleted && "text-muted-foreground line-through",
        )}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground opacity-70 transition-[color,opacity] hover:text-foreground focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        onClick={startEditing}
      >
        <span className="sr-only">Edit task</span>
        <PencilIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground opacity-70 transition-[color,opacity] hover:text-destructive focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        onClick={() => onRemove(task._id)}
      >
        <span className="sr-only">Remove task</span>
        <Trash2Icon />
      </Button>
    </div>
  );
}
