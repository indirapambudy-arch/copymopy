import type { ReactNode } from "react";
import { Logo } from "./Logo";

/** Logo on the left; whatever is passed in (usually the ProductMenu) on the right. */
export function AppHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="border-b border-grey-tertiary bg-white-main px-4 split:px-8">
      <div className="mx-auto flex min-h-header max-w-layout flex-wrap items-center gap-3 py-3">
        <Logo />
        <div className="grow" />
        {children}
      </div>
    </header>
  );
}
