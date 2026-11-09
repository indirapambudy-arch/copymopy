"use client";

import { useId, useState, type ChangeEvent } from "react";
import { cx } from "@/lib/cx";
import { Field, controlClass } from "./Field";
import { Icon } from "./Icon";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  /** Shown in grey until something is picked; can't be re-selected. */
  placeholder?: string;
  helper?: string;
  /** Replaces the helper text and turns the field red. */
  error?: string;
  disabled?: boolean;
  id?: string;
}

/** The browser's own select, drawn like the other fields, so keyboard, screen readers and phones just work. */
export function Dropdown({
  label, options, value, defaultValue, onChange, placeholder, helper, error, disabled, id,
}: DropdownProps) {
  const autoId = useId();
  const fieldId = id ?? `field-${autoId.replace(/:/g, "")}`;
  const [own, setOwn] = useState(defaultValue ?? "");
  const controlled = value !== undefined;
  const current = controlled ? value : own;

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (!controlled) setOwn(e.target.value);
    onChange?.(e);
  }

  return (
    <Field id={fieldId} label={label} helper={helper} error={error} disabled={disabled}>
      <div className="relative">
        <select
          id={fieldId}
          value={current}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helper ? `${fieldId}-msg` : undefined}
          className={cx(
            controlClass,
            "h-input cursor-pointer appearance-none truncate pr-chevron-gutter disabled:cursor-not-allowed",
            current === "" && "text-grey-secondary",
          )}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled} className="text-grey-main">
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          className={cx(
            "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-icon-sm",
            disabled ? "text-grey-textdisabled" : "text-grey-main",
          )}
        />
      </div>
    </Field>
  );
}
