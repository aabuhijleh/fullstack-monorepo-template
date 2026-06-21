import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

import { FullPageSpinner } from "~/components/full-page-spinner";
import { LoginPage } from "~/features/auth/login-page";
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
