import { Logo } from "./Logo";

interface AppHeaderProps {
  productName: string;
}

/**
 * Logo on the left, the current product on the right.
 * The product pill becomes a menu (switch, Add product, Edit product) in slice 6.
 */
export function AppHeader({ productName }: AppHeaderProps) {
  return (
    <header className="border-b border-grey-tertiary bg-white-main px-4 split:px-8">
      <div className="mx-auto flex min-h-header max-w-layout flex-wrap items-center gap-3 py-3">
        <Logo />
        <div className="grow" />
        <p className="flex items-center gap-3 text-caption-14 text-grey-secondary">
          Writing for
          <span className="inline-flex h-pill items-center rounded-full border border-grey-tertiary bg-white-main px-3 text-caption-14-bold text-grey-main">
            {productName}
          </span>
        </p>
      </div>
    </header>
  );
}
