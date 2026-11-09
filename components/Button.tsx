"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "./Icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "md" | "sm";
  /** Shows the spinner, keeps the label for screen readers and blocks clicks. */
  loading?: boolean;
  icon?: IconName;
}

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border " +
  "cursor-pointer transition-colors duration-100 " +
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring";

const sizes = {
  lg: "h-control-lg px-4 text-body-16-bold",
  md: "h-control-md px-4 text-caption-14-bold",
  sm: "h-control-sm px-3 text-caption-12-bold",
};

const variants = {
  primary:
    "border-transparent bg-blue-main text-white-main hover:bg-blue-hover active:bg-blue-clicked " +
    "disabled:bg-blue-disabled disabled:cursor-not-allowed " +
    "aria-busy:bg-blue-disabled aria-busy:cursor-not-allowed",
  secondary:
    "bg-white-main text-blue-main border-blue-main hover:bg-blue-soft " +
    "active:bg-blue-soft active:border-blue-clicked active:text-blue-clicked " +
    "disabled:text-grey-textdisabled disabled:border-grey-tertiary disabled:bg-grey-bgdisabled disabled:cursor-not-allowed " +
    "aria-busy:cursor-not-allowed",
  ghost:
    "border-transparent bg-transparent text-blue-main hover:bg-blue-soft active:text-blue-clicked " +
    "disabled:text-grey-textdisabled disabled:bg-transparent disabled:cursor-not-allowed " +
    "aria-busy:cursor-not-allowed",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  }

  return (
    <button
      {...rest}
      type={type}
      onClick={handleClick}
      aria-busy={loading || undefined}
      className={cx(base, sizes[size], variants[variant], className)}
    >
      {loading ? (
        <>
          <Icon name="loader" className="motion-safe:animate-spin" />
          <span className="sr-only">{typeof children === "string" ? children : "Loading"}</span>
        </>
      ) : (
        <>
          {icon && <Icon name={icon} />}
          {children}
        </>
      )}
    </button>
  );
}
