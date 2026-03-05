// Responsible for the URL encode/decode tool using percent-encoding.

import { useState } from "react";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/Button";

type UrlMode = "encode" | "decode";

function encodeUrl(input: string): { output: string; error: string | null } {
  try {
    return { output: encodeURIComponent(input), error: null };
  } catch {
    return { output: "", error: "编码失败，请检查输入内容。" };
  }
}

function decodeUrl(input: string): { output: string; error: string | null } {
  try {
    return { output: decodeURIComponent(input), error: null };
  } catch {
    return { output: "", error: "解码失败，输入包含无效的百分号编码序列。" };
  }
}

const urlProcessors: Record<
  UrlMode,
  (input: string) => { output: string; error: string | null }
> = {
  encode: encodeUrl,
  decode: decodeUrl,
};

export function UrlEncoder() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<UrlMode>("encode");

  function applyMode(mode: UrlMode) {
    setActiveMode(mode);
    setOutputText("");
    setErrorMessage(null);
  }

  function runProcessor() {
    const { output, error } = urlProcessors[activeMode](inputText);
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
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/tools" />
        <h1 className="text-2xl font-bold text-slate-800">URL 编解码</h1>
      </div>
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
            htmlFor="url-input"
          >
            {activeMode === "encode" ? "原始文本" : "URL 编码字符串"}
          </label>
          <textarea
            id="url-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeMode === "encode"
                ? "输入要编码的文本…"
                : "输入 URL 编码字符串…"
            }
            className="w-full h-72 p-4 font-mono text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-600"
            htmlFor="url-output"
          >
            {activeMode === "encode" ? "编码结果" : "解码结果"}
          </label>
          {errorMessage ? (
            <div className="h-72 p-4 border border-red-200 rounded-xl bg-red-50 text-red-600 text-sm overflow-auto">
              错误：{errorMessage}
            </div>
          ) : (
            <textarea
              id="url-output"
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
