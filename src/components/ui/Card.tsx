import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white border border-neutral-100 shadow-sm p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
