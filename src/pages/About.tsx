import { usePageTitle } from "../hooks/usePageTitle";

export function About() {
  usePageTitle("关于我");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
        关于我
      </h2>
      <p className="text-slate-500">这里是关于我的详细介绍页面。</p>
      <div className="mt-10 text-slate-700 space-y-4">
        <p>I'm an undergraduate student.</p>
        <p>
          GitHub:{" "}
          <a
            href="https://github.com/ResetPower26"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://github.com/ResetPower26
          </a>
        </p>
        <p>Email: resetpower26@icloud.com</p>
      </div>
    </div>
  );
}
