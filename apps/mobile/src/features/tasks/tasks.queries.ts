import { convexQuery } from "@convex-dev/react-query";
import { api } from "@workspace/backend/api";

export const tasksQueries = {
  list: () => convexQuery(api.tasks.list, {}),
};
