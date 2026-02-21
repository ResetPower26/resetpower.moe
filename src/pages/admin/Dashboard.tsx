// Responsible for rendering the admin dashboard home page.
import { useAuth } from "../../hooks/useAuth";

export function Dashboard() {
  const { userInfo } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        欢迎回来，{userInfo?.username ?? "管理员"}
      </h1>
      <p className="text-slate-500 text-sm">
        权限：{userInfo?.permission === "all" ? "全部权限" : "文章管理"}
      </p>
    </div>
  );
}
