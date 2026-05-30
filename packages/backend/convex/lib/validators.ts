import { z } from "zod";

import { zid } from "./zod";

export const taskValidator = z.object({
  taskId: zid("tasks"),
  text: z.string().trim().min(1, "Enter 1-50 characters").max(50, "Enter 1-50 characters"),
});
export const taskIdValidator = taskValidator.pick({ taskId: true });
export const taskTextValidator = taskValidator.pick({ text: true });
