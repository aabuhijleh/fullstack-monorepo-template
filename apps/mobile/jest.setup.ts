// TanStack Form's devtools event bus (@tanstack/devtools-event-client) opens a
// 1s `setInterval` reconnect loop on the first form mount whenever a global
// `CustomEvent` is present. It self-aborts after 5 retries (~5s), but tests
// finish sooner, so Jest force-exits with "a worker process has failed to exit
// gracefully". Removing the global makes the bus treat this as a non-web
// environment (its own guarded branch) and skip the reconnect loop entirely.
delete (globalThis as { CustomEvent?: unknown }).CustomEvent;
