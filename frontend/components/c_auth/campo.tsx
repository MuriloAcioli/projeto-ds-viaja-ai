import type { ReactNode } from "react";

export function Campo({
  label,
  type,
  placeholder,
  value,
  onChange,
  children,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary">{label}</label>
        {children}
      </div>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-input bg-transparent px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
