// Responsible for rendering a tag input component where users add tags one by one via Enter or comma.

import { X } from "lucide-react";
import { useState } from "react";

function TagPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-700 transition-colors"
        aria-label={`删除标签 ${label}`}
      >
        <X size={11} />
      </button>
    </span>
  );
}

function splitInput(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function TagInput({
  value,
  onChange,
  placeholder = "输入后按 Enter 添加",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  function addTags(raw: string) {
    const newTags = splitInput(raw).filter((t) => !value.includes(t));
    if (newTags.length > 0) {
      onChange([...value, ...newTags]);
    }
    setInputValue("");
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTags(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw.endsWith(",")) {
      addTags(raw.slice(0, -1));
    } else {
      setInputValue(raw);
    }
  }

  return (
    <label className="flex flex-wrap gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-text min-h-[38px]">
      {value.map((tag, i) => (
        <TagPill key={tag} label={tag} onRemove={() => removeTag(i)} />
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-24 text-sm text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
      />
    </label>
  );
}
