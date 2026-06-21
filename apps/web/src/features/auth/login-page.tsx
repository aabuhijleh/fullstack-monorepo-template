import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Spinner } from "@workspace/ui/components/spinner";
import * as React from "react";
import { z } from "zod";

import { AppLogo } from "~/components/app-logo";

export function LoginPage() {
  const [email, setEmail] = React.useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-[360px] flex-col items-center">
        <AppLogo size={44} className="mb-8" />
        {email === null ? (
          <EmailStep key="email" onSuccess={setEmail} />
        ) : (
          <CodeStep key="code" email={email} onBack={() => setEmail(null)} />
        )}
      </div>
    </main>
  );
}

const stepClassName =
  "flex w-full flex-col items-center duration-500 animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

function EmailStep({ onSuccess }: { onSuccess: (email: string) => void }) {
  const { signIn } = useAuthActions();
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: emailSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        const formData = new FormData();
        formData.append("email", value.email);
        await signIn("resend-otp", formData);
        onSuccess(value.email);
      } catch {
        setError("Failed to send code. Please try again.");
      }
    },
  });

  return (
    <div className={stepClassName}>
      <h1 className="text-center font-heading text-xl font-medium tracking-tight">
        What&apos;s your email address?
      </h1>
      <p className="mt-2 mb-6 text-center text-sm text-muted-foreground">
        We&apos;ll send you a verification code to sign in.
      </p>
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="name@example.com"
                  autoComplete="email"
                  autoFocus
                  className="h-10 px-3 text-sm md:text-sm"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        {error && <p className="mt-2 text-center text-xs text-destructive">{error}</p>}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="mt-3 h-10 w-full text-sm" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Continue with email
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}

const codeSchema = z.object({
  code: z.string().length(8, "Please enter the 8-digit code."),
});

function CodeStep({ email, onBack }: { email: string; onBack: () => void }) {
  const { signIn } = useAuthActions();
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: { code: "" },
    validators: { onSubmit: codeSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        const formData = new FormData();
        formData.append("code", value.code);
        formData.append("email", email);
        await signIn("resend-otp", formData);
      } catch {
        setError("Invalid code. Please try again.");
      }
    },
  });

  return (
    <div className={stepClassName}>
      <h1 className="text-center font-heading text-xl font-medium tracking-tight">
        Enter your verification code
      </h1>
      <p className="mt-2 mb-6 text-center text-sm text-muted-foreground">
        We sent an 8-digit code to <span className="text-foreground">{email}</span>.
      </p>
      <form
        className="flex w-full flex-col items-center"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="code">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="w-full items-center">
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Verification code
                </FieldLabel>
                <InputOTP
                  maxLength={8}
                  value={field.state.value}
                  onChange={field.handleChange}
                  id={field.name}
                  aria-invalid={isInvalid}
                  autoFocus
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="flex-1">
                    <InputOTPSlot index={0} className="h-11 flex-1 text-base" />
                    <InputOTPSlot index={1} className="h-11 flex-1 text-base" />
                    <InputOTPSlot index={2} className="h-11 flex-1 text-base" />
                    <InputOTPSlot index={3} className="h-11 flex-1 text-base" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="flex-1">
                    <InputOTPSlot index={4} className="h-11 flex-1 text-base" />
                    <InputOTPSlot index={5} className="h-11 flex-1 text-base" />
                    <InputOTPSlot index={6} className="h-11 flex-1 text-base" />
                    <InputOTPSlot index={7} className="h-11 flex-1 text-base" />
                  </InputOTPGroup>
                </InputOTP>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        {error && <p className="mt-2 text-center text-xs text-destructive">{error}</p>}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="mt-4 h-10 w-full text-sm" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Verify
            </Button>
          )}
        </form.Subscribe>
      </form>
      <Button
        type="button"
        variant="link"
        onClick={onBack}
        className="mt-4 h-auto text-xs text-muted-foreground"
      >
        Use a different email
      </Button>
    </div>
  );
}
