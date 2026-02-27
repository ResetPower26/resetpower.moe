// Responsible for rendering the admin area shell with top bar, sidebar navigation, and logout.
import {
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  Link,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const allNavItems = [
  {
    to: "/admin",
    label: "仪表盘",
    icon: LayoutDashboard,
    end: true,
    requireAll: false,
  },
  {
    to: "/admin/articles",
    label: "文章管理",
    icon: FileText,
    end: false,
    requireAll: false,
  },
  {
    to: "/admin/projects",
    label: "项目管理",
    icon: FolderKanban,
    end: false,
    requireAll: true,
  },
  {
    to: "/admin/links",
    label: "链接管理",
    icon: Link,
    end: false,
    requireAll: true,
  },
];

function SidebarNav({ permission }: { permission: string }) {
  const visibleItems = allNavItems.filter(
    (item) => !item.requireAll || permission === "all",
  );

  return (
    <nav className="w-48 shrink-0 bg-white border-r border-slate-200 py-4 px-3 flex flex-col gap-1">
      {visibleItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { userInfo, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <RouterLink to="/admin" className="text-lg font-bold text-slate-800">
          后台管理
        </RouterLink>
        <div className="flex items-center gap-4">
          {userInfo && (
            <span className="text-sm text-slate-500">
              {userInfo.username}
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {userInfo.permission === "all" ? "管理员" : "编辑"}
              </span>
            </span>
          )}
          <RouterLink
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Home size={14} />
            返回首页
          </RouterLink>
          <Button
            variant="secondary"
            className="px-3 py-1.5 text-sm flex items-center gap-1.5"
            onClick={logout}
          >
            <LogOut size={14} />
            退出登录
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav permission={userInfo?.permission ?? ""} />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
