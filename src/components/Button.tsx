import { Button as BaseUIButton } from "@base-ui/react";
import clsx from "clsx";
import type React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  children,
  ...rest
}: Props) {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400",
  };

  return (
    <BaseUIButton
      className={clsx(baseStyles, variants[variant], className)}
      {...rest}
    >
      {children}
    </BaseUIButton>
  );
}
