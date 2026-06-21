import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@workspace/ui/components/button";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { AppLogo } from "./app-logo";
import { ThemeToggle } from "./theme-toggle";

type AuthenticatedLayoutProps = React.PropsWithChildren;

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { signOut } = useAuthActions();
  const [isSigningOut, startSignOutTransition] = React.useTransition();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <header className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AppLogo size={28} className="rounded-[6px] ring-1 ring-border" />
          <h1 className="font-heading text-sm font-semibold tracking-[0.25em] text-foreground uppercase">
            Tasklit
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle size="icon-sm" />
          <Button
            variant="outline"
            size="sm"
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
