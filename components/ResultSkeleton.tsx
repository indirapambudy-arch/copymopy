export interface ResultSkeletonProps {
  /** Number of text bars under the eyebrow (default 2). The last one is shorter. */
  lines?: number;
}

/**
 * A ResultCard-shaped placeholder while results load. Hidden from screen readers:
 * announce progress once elsewhere. The pulse stops when people prefer reduced motion.
 */
export function ResultSkeleton({ lines = 2 }: ResultSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-skeleton flex-col gap-2 rounded-md border border-grey-tertiary bg-white-main p-4"
    >
      <span className="mb-2 block h-3 w-skeleton-eyebrow rounded-sm bg-grey-bgdisabled motion-safe:animate-pulse" />
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className={`block h-3 rounded-sm bg-grey-bgdisabled motion-safe:animate-pulse ${i === lines - 1 ? "w-3/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}
