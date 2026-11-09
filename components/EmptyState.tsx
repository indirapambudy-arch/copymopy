import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "./Icon";

export interface EmptyStateProps {
  title: string;
  icon?: IconName;
  /** Optional button, for example "Try an example". */
  action?: ReactNode;
  children?: ReactNode;
  /** Heading level for the title, so it fits the page outline. Defaults to 3, as in the reference. */
  headingLevel?: 2 | 3;
  /** "error" colors the icon red-main, for a failed request. */
  tone?: "default" | "error";
  className?: string;
}

/** What an area shows before there's anything in it: points to the next step. */
export function EmptyState({
  title, icon = "sparkle", action, children, headingLevel = 3, tone = "default", className,
}: EmptyStateProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div
      className={cx(
        "flex flex-col items-center gap-2 rounded-md border border-dashed border-grey-tertiary bg-white-main px-6 py-8 text-center",
        className,
      )}
    >
      <span className={cx("text-icon-lg", tone === "error" ? "text-red-main" : "text-grey-secondary")}>
        <Icon name={icon} />
      </span>
      <Heading className="text-subheading-18-bold text-grey-main">{title}</Heading>
      {children && <p className="max-w-empty-text text-caption-14 text-grey-secondary">{children}</p>}
      {action}
    </div>
  );
}
