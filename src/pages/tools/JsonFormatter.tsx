// Responsible for the JSON formatter tool: beautify or minify JSON with syntax validation.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

type FormatMode = "beautify" | "minify";

function formatJson(
  input: string,
  mode: FormatMode,
): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    const output =
      mode === "beautify"
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed);
    return { output, error: null };
  } catch (err) {
    return {
      output: "",
      error: err instanceof Error ? err.message : "无效的 JSON",
    };
  }
}

export function JsonFormatter() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<FormatMode>("beautify");

  function applyFormat(mode: FormatMode) {
    setActiveMode(mode);
    const { output, error } = formatJson(inputText, mode);
    setOutputText(output);
    setErrorMessage(error);
  }

  function clearAll() {
    setInputText("");
    setOutputText("");
    setErrorMessage(null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        type="button"
        onClick={() => navigate("/tools")}
        className="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← 返回工具栏
      </button>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">JSON 格式化</h1>
      <div className="flex gap-3 mb-4">
        <Button
          variant={activeMode === "beautify" ? "primary" : "secondary"}
          className="px-4 py-2 text-sm"
          onClick={() => applyFormat("beautify")}
        >
          美化
        </Button>
        <Button
          variant={activeMode === "minify" ? "primary" : "secondary"}
          className="px-4 py-2 text-sm"
          onClick={() => applyFormat("minify")}
        >
          压缩
        </Button>
        <Button
          variant="secondary"
          className="px-4 py-2 text-sm"
          onClick={clearAll}
        >
          清空
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-600"
            htmlFor="json-input"
          >
            输入 JSON
          </label>
          <textarea
            id="json-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-96 p-4 font-mono text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-600"
            htmlFor="json-output"
          >
            输出结果
          </label>
          {errorMessage ? (
            <div className="h-96 p-4 border border-red-200 rounded-xl bg-red-50 text-red-600 text-sm font-mono overflow-auto">
              错误：{errorMessage}
            </div>
          ) : (
            <textarea
              id="json-output"
              value={outputText}
              readOnly
              placeholder="结果将显示在此处"
              className="w-full h-96 p-4 font-mono text-sm border border-slate-200 rounded-xl resize-none bg-slate-50 focus:outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
