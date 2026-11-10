import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  selected: boolean;
  /** "checkbox" when several can be picked (brand personality), "radio" for one of a set. */
  role?: "checkbox" | "radio";
}

/** A pill-shaped choice. 36px tall, caption-14-bold. Selected is blue with a 2px border. */
export function Chip({ selected, role = "checkbox", className, type = "button", ...rest }: ChipProps) {
  return (
    <button
      {...rest}
      type={type}
      role={role}
      aria-checked={selected}
      className={cx(
        "inline-flex h-control-md items-center gap-1 rounded-full border px-4 text-caption-14-bold cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring",
        selected
          ? "border-blue-main bg-blue-soft text-blue-main shadow-chip-selected"
          : "border-grey-tertiary bg-white-main text-grey-main hover:border-grey-secondary",
        "disabled:border-grey-tertiary disabled:bg-grey-bgdisabled disabled:text-grey-textdisabled disabled:cursor-not-allowed",
        className,
      )}
    />
  );
}
