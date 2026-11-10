"use client";

import { useId, type ChangeEvent, type Ref } from "react";
import { cx } from "@/lib/cx";
import { Field, controlClass } from "./Field";

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  helper?: string;
  /** Replaces the helper text and turns the field red. */
  error?: string;
  /** Shows the "n / max" counter and caps input. */
  maxLength?: number;
  disabled?: boolean;
  id?: string;
  autoFocus?: boolean;
  ref?: Ref<HTMLInputElement>;
}

/** A single-line input with a label above, and helper, error or counter below. 40px tall. */
export function TextField({
  label, value, onChange, placeholder, helper, error, maxLength, disabled, id, autoFocus, ref,
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `field-${autoId.replace(/:/g, "")}`;
  return (
    <Field
      id={fieldId}
      label={label}
      helper={helper}
      error={error}
      disabled={disabled}
      count={maxLength ? `${value.length} / ${maxLength}` : undefined}
    >
      <input
        ref={ref}
        id={fieldId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || helper ? `${fieldId}-msg` : undefined}
        className={cx(controlClass, "h-input")}
      />
    </Field>
  );
}
