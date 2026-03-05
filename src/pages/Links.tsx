import { LinkList } from "../features/LinkList";
import { usePageTitle } from "../hooks/usePageTitle";

export function Links() {
  usePageTitle("链接");
  return <LinkList />;
}
