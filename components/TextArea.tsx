"use client";

import { useId, useState, type ChangeEvent, type Ref } from "react";
import { cx } from "@/lib/cx";
import { Field, controlClass } from "./Field";

export interface TextAreaProps {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  helper?: string;
  /** Replaces the helper text and turns the field red. */
  error?: string;
  /** Shows the "n / max" counter and caps input. */
  maxLength?: number;
  disabled?: boolean;
  id?: string;
  autoFocus?: boolean;
  rows?: number;
  ref?: Ref<HTMLTextAreaElement>;
}

export function TextArea({
  label, value, defaultValue, onChange, placeholder, helper, error,
  maxLength, disabled, id, autoFocus, rows = 4, ref,
}: TextAreaProps) {
  const autoId = useId();
  const fieldId = id ?? `field-${autoId.replace(/:/g, "")}`;
  const [own, setOwn] = useState(defaultValue ?? "");
  const controlled = value !== undefined;
  const current = controlled ? value : own;

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (!controlled) setOwn(e.target.value);
    onChange?.(e);
  }

  return (
    <Field
      id={fieldId}
      label={label}
      helper={helper}
      error={error}
      disabled={disabled}
      count={maxLength ? `${current.length} / ${maxLength}` : undefined}
    >
      <textarea
        ref={ref}
        id={fieldId}
        value={current}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        autoFocus={autoFocus}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || helper ? `${fieldId}-msg` : undefined}
        className={cx(controlClass, "min-h-textarea resize-y py-2")}
      />
    </Field>
  );
}
