import type { ReactElement } from "react";
import { cx } from "@/lib/cx";

export type IconName =
  | "copy"
  | "check"
  | "refresh"
  | "loader"
  | "close"
  | "chevron-down"
  | "upload"
  | "file"
  | "pencil"
  | "sparkle"
  | "sparkles"
  | "alert"
  | "arrow-left";

export const iconNames: IconName[] = [
  "copy", "check", "refresh", "loader", "close", "chevron-down",
  "upload", "file", "pencil", "sparkle", "sparkles", "alert", "arrow-left",
];

// 24px grid, 2px rounded stroke. Drawn with currentColor.
const paths: Record<IconName, ReactElement> = {
  // From the "Back to writing" link in docs/canvas/products.html.
  "arrow-left": (
    <>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </>
  ),
  copy: (
    <>
      <rect x={9} y={9} width={12} height={12} rx={2} />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7L20 8.6" />
      <path d="M20 3.5v5.1h-5.1" />
    </>
  ),
  loader: <path d="M21 12a9 9 0 1 1-6.2-8.6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  upload: (
    <>
      <path d="M12 15V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M10 5Q11 11 17 12Q11 13 10 19Q9 13 3 12Q9 11 10 5Z" />
      <path d="M18 2Q18.5 4.5 21 5Q18.5 5.5 18 8Q17.5 5.5 15 5Q17.5 4.5 18 2Z" />
      <path d="M19 15.5Q19.4 17.6 21.5 18Q19.4 18.4 19 20.5Q18.6 18.4 16.5 18Q18.6 17.6 19 15.5Z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 16v4M17 18h4" />
    </>
  ),
  alert: (
    <>
      <circle cx={12} cy={12} r={10} className="fill-current stroke-none" />
      <path d="M12 7v6" className="stroke-white-main" />
      <path d="M12 16.5v.5" className="stroke-white-main" />
    </>
  ),
};

export interface IconProps {
  name: IconName;
  className?: string;
}

/** Decorative inline icon, sized by font-size (1em). Hidden from screen readers. */
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={cx("size-icon flex-none", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
