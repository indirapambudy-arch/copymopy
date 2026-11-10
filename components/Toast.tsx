import { Icon, type IconName } from "./Icon";

export interface ToastProps {
  /** The message. Empty hides the toast, but keeps the live region so the next one is announced. */
  message: string;
  icon?: IconName;
}

/**
 * A short message floating at the bottom of the screen. Announced to screen readers as a status.
 * The consumer decides when to clear it (about 4 seconds).
 */
export function Toast({ message, icon = "check" }: ToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-toast z-30 flex justify-center px-4"
    >
      {message && (
        <p className="inline-flex items-center gap-2 rounded-md bg-grey-main px-4 py-3 text-caption-14 text-white-main shadow-lg">
          <Icon name={icon} className="text-icon-sm" />
          {message}
        </p>
      )}
    </div>
  );
}
