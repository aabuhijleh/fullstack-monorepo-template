import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signIn, signOut } = useAuthActions();
  const { token } = Route.useRouteContext();
  const [step, setStep] = useState<"email" | { email: string }>("email");

  if (token) {
    return (
      <div>
        <p>You are logged in</p>
        <button onClick={() => signOut().then(() => window.location.reload())}>Log out</button>
      </div>
    );
  }

  if (step === "email") {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          await signIn("resend-otp", formData);
          setStep({ email: formData.get("email") as string });
        }}
      >
        <p>Enter your email to sign in</p>
        <input name="email" placeholder="Email" type="email" />
        <button type="submit">Send code</button>
      </form>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await signIn("resend-otp", formData);
        window.location.reload();
      }}
    >
      <p>Enter the code sent to {step.email}</p>
      <input name="code" placeholder="Code" type="text" />
      <input name="email" value={step.email} type="hidden" />
      <button type="submit">Verify</button>
      <button type="button" onClick={() => setStep("email")}>
        Back
      </button>
    </form>
  );
}
