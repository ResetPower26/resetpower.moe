import { ProjectList } from "../features/ProjectList";
import { usePageTitle } from "../hooks/usePageTitle";

export function Projects() {
  usePageTitle("项目");
  return <ProjectList />;
}
