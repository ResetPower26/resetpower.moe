// Responsible for rendering the articles page with tab navigation between all articles and columns.
import { Tabs } from "@base-ui/react/tabs";
import { ArticleList } from "../features/ArticleList";
import { ColumnList } from "../features/ColumnList";
import { usePageTitle } from "../hooks/usePageTitle";

const TAB_TRIGGER_CLASS =
  "px-5 py-2 text-sm font-semibold text-slate-500 rounded-lg transition-colors cursor-pointer hover:text-slate-800 data-active:bg-blue-600 data-active:text-white data-active:shadow-sm";

export function Articles() {
  usePageTitle("文章");

  return (
    <Tabs.Root defaultValue="all" className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 sm:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            文章
          </h2>
          <p className="mt-2 text-lg leading-8 text-slate-600">一些文章🤔</p>
        </div>
        <div className="mt-8 flex justify-center">
          <Tabs.List className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <Tabs.Tab value="all" className={TAB_TRIGGER_CLASS}>
              全部文章
            </Tabs.Tab>
            <Tabs.Tab value="columns" className={TAB_TRIGGER_CLASS}>
              专栏
            </Tabs.Tab>
          </Tabs.List>
        </div>
      </div>

      <Tabs.Panel value="all">
        <ArticleList hideHeader />
      </Tabs.Panel>
      <Tabs.Panel value="columns" className="pb-24 sm:pb-32">
        <ColumnList />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
