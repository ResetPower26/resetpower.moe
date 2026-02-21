// Responsible for rendering the admin articles management page with CRUD operations and permission-based controls.
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAdminArticles } from "../../hooks/useAdminArticles";
import { useAuth } from "../../hooks/useAuth";
import type { Article } from "../../types";

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function canEditArticle(
  article: Article,
  permission: string | undefined,
  username: string | undefined,
): boolean {
  if (permission === "all") return true;
  if (permission === "articles") return article.author === username;
  return false;
}

export function AdminArticles() {
  const { articles, isLoading, error, removeArticle } = useAdminArticles();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleConfirmDelete() {
    if (deletingId === null) return;
    setIsDeleting(true);
    const success = await removeArticle(deletingId);
    setIsDeleting(false);
    if (success) {
      setDeletingId(null);
    } else {
      setActionError("删除失败，请重试");
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">文章管理</h1>
        <Button
          className="flex items-center gap-1.5 text-sm px-3 py-1.5"
          onClick={() => navigate("/admin/articles/new")}
        >
          <Plus size={16} />
          新建文章
        </Button>
      </div>

      {actionError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {actionError}
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {articles.length === 0 ? (
            <p className="text-center text-slate-400 py-12">暂无文章</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    标题
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium hidden md:table-cell">
                    作者
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium hidden lg:table-cell">
                    发布时间
                  </th>
                  <th className="px-4 py-3 text-slate-600 font-medium w-24">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => {
                  const canEdit = canEditArticle(
                    article,
                    userInfo?.permission,
                    userInfo?.username,
                  );
                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-800 font-medium max-w-xs truncate">
                        {article.title}
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                        {article.author}
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                        {formatDate(article.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {canEdit && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/articles/${article.id}/edit`)
                              }
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              title="编辑"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(article.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                              title="删除"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {deletingId !== null && (
        <ConfirmDialog
          message="确认删除该文章？此操作不可撤销。"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
