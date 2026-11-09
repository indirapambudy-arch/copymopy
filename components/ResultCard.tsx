import { cx } from "@/lib/cx";
import { Icon } from "./Icon";

export interface ResultPart {
  label: string;
  text: string;
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
  className?: string;
  // Copy, refine actions, Undo and the refining state come in slice 5.
}

/** One copy option: approach name, optional badge, the copy (or its parts) and why you'd pick it. */
export function ResultCard({ label, text, parts, badge, rationale, note, className }: ResultCardProps) {
  const hasParts = parts && parts.length > 0;
  return (
    <article
      aria-label={badge ? `${label}, ${badge.toLowerCase()}` : label}
      className={cx(
        "flex min-w-0 flex-col gap-2 rounded-md border border-grey-tertiary bg-white-main p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-caption-12-bold tracking-eyebrow text-grey-secondary uppercase">
          {label}
          {note && <span className="tracking-normal text-blue-main normal-case"> · {note}</span>}
        </h3>
        {badge && (
          <span className="rounded-full bg-blue-soft px-2 py-half text-caption-12-bold text-blue-main">{badge}</span>
        )}
      </div>

      {hasParts ? (
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

      {rationale && (
        <p className="flex items-start gap-2 text-caption-14 text-grey-secondary">
          <Icon name="sparkle" className="mt-half text-icon-xs text-blue-main" />
          <span>{rationale}</span>
        </p>
      )}
    </article>
  );
}
