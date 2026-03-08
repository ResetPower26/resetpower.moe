// Responsible for rendering the admin columns management page with CRUD operations and article selection modal.
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAdminArticles } from "../../hooks/useAdminArticles";
import { useAdminColumns } from "../../hooks/useAdminColumns";
import type { Column } from "../../types";

interface ColumnFormData {
  name: string;
  description: string;
  cover_image: string;
  selectedArticleIds: Set<string>;
}

const emptyForm: ColumnFormData = {
  name: "",
  description: "",
  cover_image: "",
  selectedArticleIds: new Set(),
};

function columnToForm(column: Column): ColumnFormData {
  return {
    name: column.name,
    description: column.description ?? "",
    cover_image: column.cover_image ?? "",
    selectedArticleIds: new Set(
      column.article_ids
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  };
}

function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ColumnFormModal({
  initial,
  onSubmit,
  onClose,
  isSubmitting,
}: {
  initial: ColumnFormData;
  onSubmit: (data: ColumnFormData) => void;
  onClose: () => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<ColumnFormData>(initial);
  const { articles, isLoading: articlesLoading } = useAdminArticles();
  const [articleSearch, setArticleSearch] = useState("");

  const setField =
    <K extends keyof Omit<ColumnFormData, "selectedArticleIds">>(field: K) =>
    (value: string) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  function toggleArticle(id: string) {
    setForm((prev) => {
      const next = new Set(prev.selectedArticleIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...prev, selectedArticleIds: next };
    });
  }

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(articleSearch.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {initial.name ? "编辑专栏" : "新建专栏"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="flex flex-col overflow-hidden flex-1"
        >
          <div className="p-6 space-y-3 overflow-y-auto flex-1">
            <InputField
              id="col-name"
              label="专栏名称"
              value={form.name}
              onChange={setField("name")}
              required
            />
            <InputField
              id="col-description"
              label="描述（可选）"
              value={form.description}
              onChange={setField("description")}
              placeholder="简要介绍这个专栏..."
            />
            <InputField
              id="col-cover"
              label="封面图 URL（可选）"
              value={form.cover_image}
              onChange={setField("cover_image")}
              placeholder="https://..."
            />

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                选择文章
                <span className="ml-2 text-xs text-slate-400 font-normal">
                  已选 {form.selectedArticleIds.size} 篇
                </span>
              </p>
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder="搜索文章标题..."
                className="w-full mb-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                {articlesLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filteredArticles.length === 0 ? (
                  <p className="text-center text-slate-400 py-6 text-sm">
                    没有匹配的文章
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {filteredArticles.map((article) => (
                        <tr
                          key={article.id}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => toggleArticle(article.id)}
                        >
                          <td className="px-3 py-2.5 w-8">
                            <input
                              type="checkbox"
                              readOnly
                              checked={form.selectedArticleIds.has(article.id)}
                              className="accent-blue-600"
                            />
                          </td>
                          <td className="px-3 py-2.5 text-slate-800 font-medium max-w-xs truncate">
                            {article.title}
                          </td>
                          <td className="px-3 py-2.5 text-slate-400 hidden sm:table-cell shrink-0">
                            {formatDate(article.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-6 pt-4 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminColumns() {
  const { columns, isLoading, error, submitColumn, removeColumn } =
    useAdminColumns();
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSubmit(data: ColumnFormData) {
    setIsSubmitting(true);
    setActionError(null);
    const articleIdsStr = Array.from(data.selectedArticleIds).join(",");
    const success = await submitColumn(
      {
        name: data.name,
        description: data.description,
        cover_image: data.cover_image,
        article_ids: articleIdsStr,
      },
      editingColumn?.id,
    );
    setIsSubmitting(false);
    if (success) {
      setEditingColumn(null);
      setIsCreating(false);
    } else {
      setActionError("操作失败，请重试");
    }
  }

  async function handleConfirmDelete() {
    if (deletingId === null) return;
    setIsDeleting(true);
    const success = await removeColumn(deletingId);
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
        <h1 className="text-2xl font-bold text-slate-900">专栏管理</h1>
        <Button
          className="flex items-center gap-1.5 text-sm px-3 py-1.5"
          onClick={() => setIsCreating(true)}
        >
          <Plus size={16} />
          新建专栏
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
          {columns.length === 0 ? (
            <p className="text-center text-slate-400 py-12">暂无专栏</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    专栏名称
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium hidden md:table-cell">
                    描述
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium hidden lg:table-cell">
                    文章数
                  </th>
                  <th className="px-4 py-3 text-slate-600 font-medium w-24">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {columns.map((column) => (
                  <tr
                    key={column.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-800 font-medium max-w-xs">
                      <div className="flex items-center gap-2.5">
                        {column.cover_image && (
                          <img
                            src={column.cover_image}
                            alt={column.name}
                            className="w-8 h-8 rounded object-cover shrink-0"
                          />
                        )}
                        <span className="truncate">{column.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-xs truncate">
                      {column.description ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                      {column.articles.length} 篇
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingColumn(column)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="编辑"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(column.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="删除"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {(isCreating || editingColumn) && (
        <ColumnFormModal
          initial={editingColumn ? columnToForm(editingColumn) : emptyForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsCreating(false);
            setEditingColumn(null);
            setActionError(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {deletingId !== null && (
        <ConfirmDialog
          message="确认删除该专栏？此操作不可撤销。"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
