import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@workspace/ui/components/button";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { ThemeToggle } from "./theme-toggle";

type AuthenticatedLayoutProps = React.PropsWithChildren;

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { signOut } = useAuthActions();
  const [isSigningOut, startSignOutTransition] = React.useTransition();

  return (
    <main className="container mx-auto p-8">
      <header className="mb-4 flex items-center justify-between">
        <h1>Tasklit</h1>
        <div className="flex gap-2">
          <ThemeToggle size="icon" />
          <Button
            variant="outline"
            size="default"
            disabled={isSigningOut}
            onClick={() => startSignOutTransition(signOut)}
          >
            {isSigningOut ? <Loader2Icon className="animate-spin" /> : null}
            Sign out
          </Button>
        </div>
      </header>

      {children}
    </main>
  );
}
