import { Spinner } from "@workspace/ui/components/spinner";

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
