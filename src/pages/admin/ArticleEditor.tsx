// Responsible for rendering the article create/edit form with live Markdown preview.
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Button } from "../../components/Button";
import { TagInput } from "../../components/TagInput";
import { useAdminArticles } from "../../hooks/useAdminArticles";
import type { ArticleInput } from "../../services/articles";
import { fetchArticleById } from "../../services/articles";

interface ArticleFormState extends Omit<ArticleInput, "tags"> {
  tags: string[];
}

const emptyForm: ArticleFormState = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  tags: [],
  disclosure: "",
};

function articleInputFromForm(form: ArticleFormState): ArticleInput {
  return { ...form, tags: form.tags.join(";") };
}

function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  readOnly,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
        {readOnly && (
          <span className="ml-2 text-xs text-slate-400">
            （创建后不可修改）
          </span>
        )}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className={`w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${readOnly ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 max-w-4xl">
      <div className="h-8 w-48 rounded bg-slate-200" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 rounded bg-slate-200" />
      ))}
      <div className="h-64 rounded bg-slate-200" />
    </div>
  );
}

export function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined;
  const navigate = useNavigate();
  const { submitArticle } = useAdminArticles();

  const [form, setForm] = useState<ArticleFormState>(emptyForm);
  const [isLoadingArticle, setIsLoadingArticle] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = useCallback(
    <K extends keyof ArticleFormState>(field: K) =>
      (value: ArticleFormState[K]) =>
        setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  useEffect(() => {
    if (!isEditing) return;
    setIsLoadingArticle(true);
    fetchArticleById(id)
      .then((article) => {
        setForm({
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          content: article.content,
          tags: article.tags,
          disclosure: article.disclosure ?? "",
        });
      })
      .catch(() => setLoadError("加载文章失败，请刷新重试"))
      .finally(() => setIsLoadingArticle(false));
  }, [id, isEditing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const result = await submitArticle(
      articleInputFromForm(form),
      isEditing ? id : undefined,
    );
    setIsSubmitting(false);
    if (result.success) {
      navigate("/admin/articles");
    } else if (result.conflict) {
      setSubmitError("Slug 已存在，请使用其他 slug");
    } else {
      setSubmitError("保存失败，请重试");
    }
  }

  if (isLoadingArticle) return <LoadingSkeleton />;

  if (loadError) {
    return (
      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
        {loadError}
      </p>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditing ? "编辑文章" : "新建文章"}
        </h1>
        <Button
          variant="secondary"
          className="text-sm px-3 py-1.5"
          onClick={() => navigate("/admin/articles")}
        >
          ← 返回列表
        </Button>
      </div>

      {submitError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {submitError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="title"
            label="标题"
            value={form.title}
            onChange={setField("title")}
            required
          />
          <InputField
            id="slug"
            label="Slug"
            value={form.slug}
            onChange={isEditing ? undefined : setField("slug")}
            placeholder="my-article-slug"
            required={!isEditing}
            readOnly={isEditing}
          />
        </div>

        <InputField
          id="summary"
          label="摘要"
          value={form.summary}
          onChange={setField("summary")}
          placeholder="文章简短摘要"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="block text-sm font-medium text-slate-700 mb-1">
              标签
            </p>
            <TagInput value={form.tags} onChange={setField("tags")} />
          </div>
          <InputField
            id="disclosure"
            label="创作声明（可选）"
            value={form.disclosure}
            onChange={setField("disclosure")}
            placeholder="如：部分内容由 AI 辅助生成"
          />
        </div>

        {/* Content editor + live preview */}
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-1">
            正文内容
          </p>
          <div className="grid grid-cols-2 gap-4 h-[480px]">
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setField("content")(e.target.value)}
              required
              placeholder="在此输入 Markdown 内容..."
              className="w-full h-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <div className="h-full overflow-auto rounded-lg border border-slate-200 bg-white px-4 py-3">
              <div className="prose prose-slate max-w-none text-sm">
                {form.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {form.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-slate-400 text-sm">预览区域</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/admin/articles")}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </div>
  );
}
