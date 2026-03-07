// Responsible for rendering the "About Me" page with a bio section and platform links.
import { Mail } from "lucide-react";
import { Card } from "../components/Card";
import { usePageTitle } from "../hooks/usePageTitle";

interface PlatformLink {
  name: string;
  handle: string;
  href?: string;
  icon: React.ReactNode;
  color: string;
}

const platformLinks: PlatformLink[] = [
  {
    name: "GitHub",
    handle: "ResetPower26",
    href: "https://github.com/ResetPower26",
    icon: (
      <img
        src="/icons/GitHub_Invertocat_Black.svg"
        alt="GitHub"
        className="w-6 h-6"
      />
    ),
    color: "text-slate-800",
  },
  {
    name: "Email",
    handle: "resetpower26@icloud.com",
    icon: <Mail size={24} className="text-blue-500" />,
    color: "text-blue-600",
  },
];

function BioSection() {
  return (
    <Card className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <img
        src="/avatar.png"
        alt="Avatar"
        className="w-24 h-24 rounded-full object-cover shrink-0"
      />
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900">ResetPower</h2>
        <p className="text-slate-500 leading-relaxed">
          I'm an undergraduate student.
        </p>
      </div>
    </Card>
  );
}

function PlatformCard({ platform }: { platform: PlatformLink }) {
  const inner = (
    <Card
      className={`p-5 flex items-center gap-4 ${platform.href ? "cursor-pointer" : ""}`}
    >
      <div className="shrink-0">{platform.icon}</div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-slate-600">
          {platform.name}
        </span>
        <span
          className={`text-sm truncate ${platform.color} ${platform.href ? "hover:underline" : ""}`}
        >
          {platform.handle}
        </span>
      </div>
    </Card>
  );

  if (platform.href) {
    return (
      <a
        href={platform.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

function PlatformLinksSection() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 mb-4">平台链接</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platformLinks.map((platform) => (
          <PlatformCard key={platform.name} platform={platform} />
        ))}
      </div>
    </div>
  );
}

export function About() {
  usePageTitle("关于我");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          关于我
        </h1>
        <p className="text-slate-500">这里是关于我的详细介绍页面。</p>
      </div>
      <div className="max-w-2xl flex flex-col gap-8">
        <BioSection />
        <PlatformLinksSection />
      </div>
    </div>
  );
}
