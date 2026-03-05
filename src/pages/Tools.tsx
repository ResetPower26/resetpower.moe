// Responsible for rendering the tools index page (card grid of available utilities).

import { ToolList } from "../features/ToolList";
import { usePageTitle } from "../hooks/usePageTitle";

export function Tools() {
  usePageTitle("工具栏");
  return <ToolList />;
}
