// Responsible for rendering a circular icon-only back navigation button.
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BackButton({ to }: { to: string }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      aria-label="返回"
      className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 text-slate-700 cursor-pointer hover:text-blue-600 hover:border-blue-400 transition-colors"
    >
      <ArrowLeft size={18} strokeWidth={2.5} />
    </button>
  );
}
