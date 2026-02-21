// Responsible for rendering a generic dropdown select using @base-ui/react primitives.
import { Select } from "@base-ui/react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export function DropdownSelect<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label: string;
}) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? label;

  return (
    <Select.Root
      value={value}
      onValueChange={(v) => {
        if (v !== null) onChange(v);
      }}
    >
      <Select.Trigger
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
        aria-label={label}
      >
        <Select.Value>{selectedLabel}</Select.Value>
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={6}>
          <Select.Popup className="z-50 min-w-40 rounded-lg border border-slate-200 bg-white shadow-lg py-1 outline-none">
            <Select.List>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 outline-none data-[highlighted]:bg-slate-50"
                >
                  <Select.ItemIndicator className="shrink-0">
                    <Check size={12} className="text-blue-600" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
