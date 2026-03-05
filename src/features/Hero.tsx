import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            欢迎来到我的数字花园
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            是一个小猫的喵窝喵喵喵喵喵喵
          </p>
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
            <Link
              to="/articles"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 hover:scale-105"
            >
              阅读文章
            </Link>
            <Link
              to="/tools"
              className="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              实用工具 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Right Content - Avatar */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse" />
            <img
              src="/avatar.png"
              alt="Avatar"
              className="relative w-full h-full rounded-full object-cover shadow-xl border-4 border-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
