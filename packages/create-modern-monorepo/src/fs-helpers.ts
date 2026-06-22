/** Type guard for Node's errno exceptions — lets callers check `error.code`
 *  (e.g. "ENOENT") without an unsafe `as NodeJS.ErrnoException` assertion. */
export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
