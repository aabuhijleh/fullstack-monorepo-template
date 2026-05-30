import concurrently from "concurrently";
import { z } from "zod";

const type = z.enum(["check", "fix"]).default("check").parse(process.argv.slice(2)[0]);

const commands = {
  check: [
    { command: "bun run lint", name: "lint", prefixColor: "blue" },
    { command: "bun run format:check", name: "format", prefixColor: "magenta" },
  ],
  fix: [
    { command: "bun run lint:fix", name: "lint", prefixColor: "blue" },
    { command: "bun run format", name: "format", prefixColor: "magenta" },
  ],
  common: [],
};

const { result } = concurrently(commands[type].concat(commands.common));

result.catch(() => process.exit(1));
