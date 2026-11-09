import { cx } from "@/lib/cx";

export interface LogoProps {
  /** "lockup" = mark + wordmark (default); "mark" = the square alone, labelled "Copymopy" for screen readers. */
  variant?: "lockup" | "mark";
  /** Mark size in px (default 32). The wordmark scales with it. At 20px and below the mark uses the two-pill cut. */
  size?: number;
  /** White mark and wordmark, for blue-main or dark grounds. */
  inverse?: boolean;
  className?: string;
}

// Pills as [x, y, width, height] on a 48px square: three options, or two at small sizes.
const threePills = [[11, 12, 26, 6], [11, 21, 18, 6], [11, 30, 22, 6]];
const twoPills = [[9, 12, 30, 9], [9, 27, 20, 9]];

function LogoMark({ size, inverse }: { size: number; inverse: boolean }) {
  const pills = size <= 20 ? twoPills : threePills;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className="block flex-none"
    >
      <rect width={48} height={48} rx={12} className={inverse ? "fill-white-main" : "fill-blue-main"} />
      {pills.map(([x, y, w, h]) => (
        <rect
          key={y}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={h / 2}
          className={inverse ? "fill-blue-main" : "fill-white-main"}
        />
      ))}
    </svg>
  );
}

export function Logo({ variant = "lockup", size = 32, inverse = false, className }: LogoProps) {
  if (variant === "mark") {
    return (
      <span role="img" aria-label="Copymopy" className={cx("inline-flex items-center", className)}>
        <LogoMark size={size} inverse={inverse} />
      </span>
    );
  }

  // The gap and wordmark size are proportional to the mark, as in the reference implementation.
  return (
    <span
      className={cx("inline-flex items-center", inverse ? "text-white-main" : "text-grey-main", className)}
      style={{ gap: Math.round(size * 0.3) }}
    >
      <LogoMark size={size} inverse={inverse} />
      <span
        className="font-sans font-bold tracking-logo whitespace-nowrap"
        style={{ fontSize: Math.round(size * 0.66), lineHeight: `${Math.round(size * 0.75)}px` }}
      >
        Copymopy
      </span>
    </span>
  );
}
