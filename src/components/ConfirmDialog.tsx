// Responsible for rendering a reusable delete confirmation modal dialog.
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  isLoading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
        <div className="flex items-start gap-3 mb-5">
          <AlertTriangle
            size={20}
            className="text-red-500 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-slate-700">{message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "删除中..." : "确认删除"}
          </Button>
        </div>
      </div>
    </div>
  );
}
