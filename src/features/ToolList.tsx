// Responsible for rendering the tools index page with a card grid of available utilities.
import { Binary, FileJson, Hash, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";

interface ToolEntry {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const toolEntries: ToolEntry[] = [
  {
    title: "JSON 格式化",
    description: "美化或压缩 JSON 数据，快速校验语法错误。",
    icon: <FileJson size={28} className="text-blue-500" />,
    href: "/tools/json-formatter",
  },
  {
    title: "Base64 编解码",
    description: "将文本或二进制数据进行 Base64 编码与解码。",
    icon: <Binary size={28} className="text-violet-500" />,
    href: "/tools/base64",
  },
  {
    title: "哈希值计算",
    description: "支持 MD5、SHA-1、SHA-256、SHA-512 等多种算法。",
    icon: <Hash size={28} className="text-emerald-500" />,
    href: "/tools/hash",
  },
  {
    title: "URL 编解码",
    description: "对 URL 中的特殊字符进行百分号编码与解码。",
    icon: <Link size={28} className="text-orange-500" />,
    href: "/tools/url-encoder",
  },
];

export function ToolList() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">工具栏</h1>
        <p className="text-slate-500">
          常用开发工具，点击卡片进入对应工具页面。
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {toolEntries.map((tool) => (
          <button
            key={tool.href}
            type="button"
            onClick={() => navigate(tool.href)}
            className="text-left w-full"
          >
            <Card className="p-6 flex flex-col gap-4 cursor-pointer h-full">
              <div className="flex items-center gap-3">
                {tool.icon}
                <span className="text-lg font-semibold text-slate-800">
                  {tool.title}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {tool.description}
              </p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
