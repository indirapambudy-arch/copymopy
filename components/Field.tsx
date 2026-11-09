import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";

/** Shared look for the field controls (text area, dropdown): border, hover, focus, error, disabled. */
export const controlClass =
  "w-full rounded-sm border border-grey-tertiary bg-white-main px-3 text-body-16 text-grey-main " +
  "placeholder:text-grey-secondary hover:border-grey-secondary " +
  "focus:outline-none focus:border-blue-main focus:shadow-field-focus " +
  // Errors stay red on hover and focus, so "!" (important) wins over the rules above.
  "aria-invalid:border-red-main! aria-invalid:shadow-field-error! " +
  "disabled:bg-grey-bgdisabled disabled:text-grey-textdisabled disabled:border-grey-tertiary " +
  "disabled:shadow-none disabled:cursor-not-allowed";

interface FieldProps {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  /** "n / max" counter, when the field has a maxLength. */
  count?: string;
  children: ReactNode;
}

/** Label above, control, then helper or error message (and counter) below. */
export function Field({ id, label, helper, error, disabled, count, children }: FieldProps) {
  const message = error || helper;
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className={cx("text-caption-14", disabled ? "text-grey-textdisabled" : "text-grey-main")}>
        {label}
      </label>
      {children}
      {(message || count) && (
        <div className="mt-1 flex justify-between gap-2 text-caption-12 text-grey-secondary">
          {message && (
            <span
              id={`${id}-msg`}
              role={error ? "alert" : undefined}
              className={cx("inline-flex items-center gap-1", error && "text-red-main")}
            >
              {error && <Icon name="alert" />}
              {message}
            </span>
          )}
          {count && (
            <span className="ml-auto tabular-nums" aria-live="polite">
              {count}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
