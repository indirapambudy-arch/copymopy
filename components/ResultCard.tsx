"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";

export interface ResultPart {
  label: string;
  text: string;
}

export interface RefineOption {
  value: string;
  label: string;
}

export interface ResultCardProps {
  /** The approach name, e.g. "Direct". Shown as the eyebrow and used as the card's accessible name. */
  label: string;
  /** Single-part copy. Ignored when `parts` is given. */
  text?: string;
  /** Multi-part copy, e.g. Title / Body / Button for an error. Shown as labelled lines. */
  parts?: ResultPart[];
  /** Small blue pill after the label, e.g. "Recommended". */
  badge?: string;
  /** One line under the copy saying when you'd pick this option. */
  rationale?: string;
  /** Short note after the label once refined, e.g. "Shorter". */
  note?: string;
  /** Small pill buttons under the copy, e.g. Shorter, More casual. Each calls `onRefine` with its value. */
  refineOptions?: readonly RefineOption[];
  onRefine?: (value: string) => void;
  /** While true the copy becomes a loading placeholder and the actions can't be used. */
  refining?: boolean;
  /** Shows Undo after the refine actions. */
  onUndo?: () => void;
  /** Called with the copied text, e.g. for analytics or a Toast. */
  onCopy?: (text: string) => void;
  className?: string;
}

/** How long the Copy button shows "Copied". */
const COPIED_MS = 2000;

/** Writes text to the clipboard, with a fallback for browsers that block the Clipboard API. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.className = "sr-only";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

const pill = cx(
  "inline-flex min-h-control-sm items-center gap-1 rounded-full border px-3 text-caption-12-bold cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring",
  "aria-disabled:cursor-not-allowed",
);

/**
 * One copy option: approach name, optional badge, the copy (or its parts) and why you'd pick it,
 * with Copy, optional refine actions and Undo.
 *
 * Busy controls use aria-disabled rather than disabled, so keyboard focus stays on the button
 * you pressed while the card refines.
 */
export function ResultCard({
  label,
  text,
  parts,
  badge,
  rationale,
  note,
  refineOptions = [],
  onRefine,
  refining = false,
  onUndo,
  onCopy,
  className,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const firstRefineRef = useRef<HTMLButtonElement>(null);
  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const hasParts = parts && parts.length > 0;
  const fullText = hasParts ? parts.map((p) => p.text).join("\n\n") : (text ?? "");

  async function copy() {
    if (refining) return;
    if (!(await copyText(fullText))) return;
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
    onCopy?.(fullText);
  }

  function undo() {
    if (refining || !onUndo) return;
    onUndo();
    // Undo disappears once used, so move focus somewhere sensible instead of losing it.
    firstRefineRef.current?.focus();
  }

  const showActions = refineOptions.length > 0 || onUndo;

  return (
    <article
      aria-label={badge ? `${label}, ${badge.toLowerCase()}` : label}
      aria-busy={refining || undefined}
      className={cx(
        "flex min-w-0 flex-col gap-2 rounded-md border border-grey-tertiary bg-white-main p-4",
        className,
      )}
    >
      <div className="-mt-2 -mr-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="text-caption-12-bold tracking-eyebrow text-grey-secondary uppercase">
            {label}
            {note && <span className="tracking-normal text-blue-main normal-case"> · {note}</span>}
          </h3>
          {badge && (
            <span className="rounded-full bg-blue-soft px-2 py-half text-caption-12-bold text-blue-main">{badge}</span>
          )}
        </div>

        {/* One button for both states, so focus stays put; "Copied" keeps the same 36px height. */}
        <button
          type="button"
          onClick={copy}
          aria-disabled={refining || undefined}
          aria-label={`Copy ${label}`}
          title={copied ? undefined : `Copy ${label}`}
          className={cx(
            "inline-flex h-control-md min-w-control-md shrink-0 items-center justify-center gap-1 rounded-sm",
            "border-0 bg-transparent cursor-pointer",
            "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring",
            "aria-disabled:cursor-not-allowed aria-disabled:text-grey-textdisabled aria-disabled:hover:bg-transparent",
            copied
              ? "px-2 text-caption-12-bold text-green-main"
              : "text-icon-sm text-grey-main hover:bg-grey-bgdisabled active:text-blue-main",
          )}
        >
          {copied ? (
            <>
              <Icon name="check" className="text-icon-xs" />
              <span aria-hidden="true">Copied</span>
            </>
          ) : (
            <Icon name="copy" />
          )}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? `Copied ${label}` : ""}
        </span>
      </div>

      {refining ? (
        <div className="flex flex-col gap-2 py-1" aria-hidden="true">
          <span className="block h-3 w-full rounded-sm bg-grey-bgdisabled motion-safe:animate-pulse" />
          <span className="block h-3 w-3/5 rounded-sm bg-grey-bgdisabled motion-safe:animate-pulse" />
        </div>
      ) : hasParts ? (
        <dl className="flex flex-col gap-3">
          {parts.map((p) => (
            <div key={p.label}>
              <dt className="mb-half text-caption-12 text-grey-secondary">{p.label}</dt>
              <dd className="text-body-16 wrap-anywhere text-grey-main">{p.text}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-body-16 wrap-anywhere text-grey-main">{text}</p>
      )}

      {rationale && !refining && (
        <p className="flex items-start gap-2 text-caption-14 text-grey-secondary">
          <Icon name="sparkle" className="mt-half text-icon-xs text-blue-main" />
          <span>{rationale}</span>
        </p>
      )}

      {showActions && (
        <div role="group" aria-label={`Refine ${label}`} className="mt-2 flex flex-wrap gap-2">
          {refineOptions.map((o, i) => (
            <button
              key={o.value}
              ref={i === 0 ? firstRefineRef : undefined}
              type="button"
              aria-disabled={refining || undefined}
              onClick={() => {
                if (!refining) onRefine?.(o.value);
              }}
              className={cx(
                pill,
                "border-grey-tertiary bg-white-main text-grey-main",
                "hover:border-blue-main hover:bg-blue-soft hover:text-blue-main",
                "aria-disabled:border-grey-tertiary aria-disabled:bg-grey-bgdisabled aria-disabled:text-grey-textdisabled",
              )}
            >
              {o.label}
            </button>
          ))}
          {onUndo && (
            <button
              type="button"
              aria-disabled={refining || undefined}
              onClick={undo}
              className={cx(
                pill,
                "border-transparent bg-transparent text-blue-main hover:bg-blue-soft",
                "aria-disabled:text-grey-textdisabled aria-disabled:hover:bg-transparent",
              )}
            >
              Undo
            </button>
          )}
        </div>
      )}
    </article>
  );
}
