// Responsible for rendering the articles page with tab navigation between all articles and columns.
// Tab state is synced to the URL hash: #all (default) and #columns.
import { Tabs } from "@base-ui/react/tabs";
import { useCallback, useEffect, useState } from "react";
import { ArticleList } from "../features/ArticleList";
import { ColumnList } from "../features/ColumnList";
import { usePageTitle } from "../hooks/usePageTitle";

type TabValue = "all" | "columns";

const VALID_TABS: TabValue[] = ["all", "columns"];

function resolveTabFromHash(hash: string): TabValue {
  const raw = hash.replace("#", "") as TabValue;
  return VALID_TABS.includes(raw) ? raw : "all";
}

const TAB_TRIGGER_CLASS =
  "px-5 py-2 text-sm font-semibold text-slate-500 rounded-lg transition-colors cursor-pointer hover:text-slate-800 data-active:bg-blue-600 data-active:text-white data-active:shadow-sm";

export function Articles() {
  usePageTitle("文章");

  const [activeTab, setActiveTab] = useState<TabValue>(() =>
    resolveTabFromHash(window.location.hash),
  );

  // Sync tab → hash when user switches tabs.
  const handleTabChange = useCallback((value: TabValue | null) => {
    if (!value) return;
    setActiveTab(value);
    window.history.replaceState(null, "", `#${value}`);
  }, []);

  // Sync hash → tab when user navigates back/forward.
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(resolveTabFromHash(window.location.hash));
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className="bg-slate-50 min-h-screen"
    >
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
