import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Spinner } from "@workspace/ui/components/spinner";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useState } from "react";
import { z } from "zod";

import { FullPageSpinner } from "~/components/full-page-spinner";
import { generateMetadata } from "~/lib/utils/generate-metadata";

export const Route = createFileRoute("/login")({
  head: () => generateMetadata({ title: "Sign in" }),
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <>
      <AuthLoading>
        <FullPageSpinner />
      </AuthLoading>

      <Authenticated>
        <Navigate to="/" />
      </Authenticated>

      <Unauthenticated>
        <LoginPage />
      </Unauthenticated>
    </>
  );
}

const emailSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

const codeSchema = z.object({
  code: z.string().length(8, "Please enter the 8-digit code."),
});

function LoginPage() {
  const [step, setStep] = useState<"email" | { email: string }>("email");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        {step === "email" ? (
          <EmailStep onSuccess={(email) => setStep({ email })} />
        ) : (
          <CodeStep email={step.email} onBack={() => setStep("email")} />
        )}
      </Card>
    </main>
  );
}

function EmailStep({ onSuccess }: { onSuccess: (email: string) => void }) {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);

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
    <>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email to receive a verification code.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
                {isSubmitting && <Spinner />}
                Send code
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </>
  );
}

function CodeStep({ email, onBack }: { email: string; onBack: () => void }) {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);

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
    <>
      <CardHeader>
        <CardTitle>Verify code</CardTitle>
        <CardDescription>Enter the 8-digit code sent to {email}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="code">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Verification code</FieldLabel>
                    <InputOTP
                      maxLength={8}
                      value={field.state.value}
                      onChange={field.handleChange}
                      id={field.name}
                      aria-invalid={isInvalid}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <div className="mt-4 flex gap-2">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  Verify
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </>
  );
}
