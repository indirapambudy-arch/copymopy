import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "./Icon";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Required: becomes the aria-label and the tooltip. */
  label: string;
  size?: "md" | "sm";
}

const sizes = {
  md: "size-control-lg text-icon-md", // 44px, meets the touch-target minimum
  sm: "size-control-md text-icon-sm", // 36px, for dense spots like the result-card header
};

export function IconButton({ icon, label, size = "md", className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex items-center justify-center rounded-sm border-0 bg-transparent text-grey-main cursor-pointer",
        "hover:bg-grey-bgdisabled active:text-blue-main",
        "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring",
        "disabled:text-grey-textdisabled disabled:bg-transparent disabled:cursor-not-allowed",
        sizes[size],
        className,
      )}
    >
      <Icon name={icon} />
    </button>
  );
}
