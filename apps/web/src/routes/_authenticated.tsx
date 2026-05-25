import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

import { FullPageSpinner } from "~/ui/full-page-spinner";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <>
      <AuthLoading>
        <FullPageSpinner />
      </AuthLoading>

      <Authenticated>
        <Outlet />
      </Authenticated>

      <Unauthenticated>
        <Navigate to="/login" />
      </Unauthenticated>
    </>
  );
}
