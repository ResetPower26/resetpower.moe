// Responsible for the Base64 encode/decode tool.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

type Base64Mode = "encode" | "decode";

function encodeBase64(input: string): { output: string; error: string | null } {
  try {
    return { output: btoa(unescape(encodeURIComponent(input))), error: null };
  } catch {
    return { output: "", error: "编码失败，请检查输入内容。" };
  }
}

function decodeBase64(input: string): { output: string; error: string | null } {
  try {
    return {
      output: decodeURIComponent(escape(atob(input.trim()))),
      error: null,
    };
  } catch {
    return { output: "", error: "解码失败，输入不是有效的 Base64 字符串。" };
  }
}

const base64Processors: Record<
  Base64Mode,
  (input: string) => { output: string; error: string | null }
> = {
  encode: encodeBase64,
  decode: decodeBase64,
};

export function Base64Tool() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<Base64Mode>("encode");

  function applyMode(mode: Base64Mode) {
    setActiveMode(mode);
    setOutputText("");
    setErrorMessage(null);
  }

  function runProcessor() {
    const { output, error } = base64Processors[activeMode](inputText);
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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Base64 编解码</h1>
      <div className="flex gap-3 mb-4">
        <Button
          variant={activeMode === "encode" ? "primary" : "secondary"}
          className="px-4 py-2 text-sm"
          onClick={() => applyMode("encode")}
        >
          编码
        </Button>
        <Button
          variant={activeMode === "decode" ? "primary" : "secondary"}
          className="px-4 py-2 text-sm"
          onClick={() => applyMode("decode")}
        >
          解码
        </Button>
        <Button
          variant="primary"
          className="px-4 py-2 text-sm"
          onClick={runProcessor}
        >
          执行
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
            htmlFor="base64-input"
          >
            {activeMode === "encode" ? "原始文本" : "Base64 字符串"}
          </label>
          <textarea
            id="base64-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeMode === "encode"
                ? "输入要编码的文本…"
                : "输入 Base64 字符串…"
            }
            className="w-full h-72 p-4 font-mono text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-600"
            htmlFor="base64-output"
          >
            {activeMode === "encode" ? "Base64 结果" : "解码结果"}
          </label>
          {errorMessage ? (
            <div className="h-72 p-4 border border-red-200 rounded-xl bg-red-50 text-red-600 text-sm overflow-auto">
              错误：{errorMessage}
            </div>
          ) : (
            <textarea
              id="base64-output"
              value={outputText}
              readOnly
              placeholder="结果将显示在此处"
              className="w-full h-72 p-4 font-mono text-sm border border-slate-200 rounded-xl resize-none bg-slate-50 focus:outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
