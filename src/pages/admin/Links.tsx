// Responsible for rendering the admin link exchange management page with full CRUD operations.
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAdminLinks } from "../../hooks/useAdminLinks";
import type { SocialLink } from "../../types";

interface LinkFormData {
  name: string;
  description: string;
  avatar: string;
  link: string;
}

const emptyForm: LinkFormData = {
  name: "",
  description: "",
  avatar: "",
  link: "",
};

function linkToForm(link: SocialLink): LinkFormData {
  return {
    name: link.name,
    description: link.description,
    avatar: link.avatar,
    link: link.link,
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

function LinkFormModal({
  initial,
  onSubmit,
  onClose,
  isSubmitting,
}: {
  initial: LinkFormData;
  onSubmit: (data: LinkFormData) => void;
  onClose: () => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<LinkFormData>(initial);
  const setField = (field: keyof LinkFormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {initial.name ? "编辑链接" : "新建链接"}
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
          className="space-y-3"
        >
          <InputField
            id="name"
            label="名称"
            value={form.name}
            onChange={setField("name")}
            required
          />
          <InputField
            id="description"
            label="描述"
            value={form.description}
            onChange={setField("description")}
            required
          />
          <InputField
            id="avatar"
            label="头像 URL"
            value={form.avatar}
            onChange={setField("avatar")}
            placeholder="https://..."
            required
          />
          <InputField
            id="link"
            label="链接 URL"
            value={form.link}
            onChange={setField("link")}
            placeholder="https://..."
            required
          />
          <div className="flex justify-end gap-2 pt-2">
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

export function AdminLinks() {
  const { links, isLoading, error, submitLink, removeLink } = useAdminLinks();
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSubmit(data: LinkFormData) {
    setIsSubmitting(true);
    setActionError(null);
    const success = await submitLink(data, editingLink?.id);
    setIsSubmitting(false);
    if (success) {
      setEditingLink(null);
      setIsCreating(false);
    } else {
      setActionError("操作失败，请重试");
    }
  }

  async function handleConfirmDelete() {
    if (deletingId === null) return;
    setIsDeleting(true);
    const success = await removeLink(deletingId);
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
        <h1 className="text-2xl font-bold text-slate-900">链接管理</h1>
        <Button
          className="flex items-center gap-1.5 text-sm px-3 py-1.5"
          onClick={() => setIsCreating(true)}
        >
          <Plus size={16} />
          新建链接
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
          {links.length === 0 ? (
            <p className="text-center text-slate-400 py-12">暂无链接</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    头像
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    名称
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium hidden md:table-cell">
                    描述
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium hidden lg:table-cell">
                    链接
                  </th>
                  <th className="px-4 py-3 text-slate-600 font-medium w-24">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {links.map((link) => (
                  <tr
                    key={link.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={link.avatar}
                        alt={link.name}
                        className="w-8 h-8 rounded-full object-cover bg-slate-100"
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {link.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-xs truncate">
                      {link.description}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate block max-w-xs"
                      >
                        {link.link}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingLink(link)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="编辑"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(link.id)}
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

      {(isCreating || editingLink) && (
        <LinkFormModal
          initial={editingLink ? linkToForm(editingLink) : emptyForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsCreating(false);
            setEditingLink(null);
            setActionError(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {deletingId !== null && (
        <ConfirmDialog
          message="确认删除该链接？此操作不可撤销。"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
