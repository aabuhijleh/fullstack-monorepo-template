import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

import { AuthenticatedLayout } from "~/app/components/authenticated-layout";
import { FullPageSpinner } from "~/components/full-page-spinner";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGuard,
});

function AuthGuard() {
  return (
    <>
      <AuthLoading>
        <FullPageSpinner />
      </AuthLoading>

      <Authenticated>
        <AuthenticatedLayout>
          <Outlet />
        </AuthenticatedLayout>
      </Authenticated>

      <Unauthenticated>
        <Navigate to="/login" />
      </Unauthenticated>
    </>
  );
}
