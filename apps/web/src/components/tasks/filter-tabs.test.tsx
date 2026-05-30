import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { FilterTabs } from "./filter-tabs";

test("invokes onChange when a tab is selected", async () => {
  const onChange = vi.fn();
  render(<FilterTabs value="all" onChange={onChange} />);
  await userEvent.click(screen.getByRole("tab", { name: "Active" }));
  expect(onChange).toHaveBeenCalledWith("active");
});
