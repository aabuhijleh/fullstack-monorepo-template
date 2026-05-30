import { useForm } from "@tanstack/react-form";
import { taskTextSchema } from "@workspace/backend/validators";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";

export function TaskComposer({ onAdd }: { onAdd: (text: string) => Promise<unknown> }) {
  const form = useForm({
    defaultValues: { text: "" },
    validators: {
      onSubmit: ({ value }) =>
        taskTextSchema.safeParse(value.text).success ? undefined : "Enter 1–256 characters",
    },
    onSubmit: async ({ value, formApi }) => {
      await onAdd(value.text.trim());
      formApi.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="flex items-start gap-2"
    >
      <form.Field name="text">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="flex-1">
              <Input
                aria-label="New task"
                placeholder="Add a task…"
                value={field.state.value}
                aria-invalid={isInvalid}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {isInvalid && (
                <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
              )}
            </Field>
          );
        }}
      </form.Field>
      <Button type="submit">Add</Button>
    </form>
  );
}
