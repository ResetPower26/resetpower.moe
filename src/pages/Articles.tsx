import { ArticleList } from "../features/ArticleList";
import { usePageTitle } from "../hooks/usePageTitle";

export function Articles() {
  usePageTitle("文章");
  return <ArticleList />;
}
