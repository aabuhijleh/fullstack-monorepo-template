import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.token) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
