"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import { setCurrentProduct, type ProductState } from "@/lib/products";
import { Icon } from "./Icon";

export interface ProductMenuProps {
  /** Words before the pill: "Writing for" on Write, "Product" on Products. */
  label: string;
  state: ProductState;
  /** Show "Edit product" (hidden on the Products page, where you already are). */
  showEdit?: boolean;
}

const itemClass = cx(
  "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-caption-14 text-grey-main",
  "cursor-pointer hover:bg-bg-page focus:bg-bg-page focus-visible:outline-2 focus-visible:outline-transparent",
  "focus-visible:shadow-field-focus",
);

/**
 * The "Writing for" pill and its menu: products (a check on the current one), then Add product and
 * Edit product. Follows the menu button pattern: Enter, Space or Down opens it, arrows move,
 * Escape closes and returns focus to the pill.
 */
export function ProductMenu({ label, state, showEdit = true }: ProductMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const current = state.products.find((p) => p.id === state.currentId) ?? state.products[0];

  const items = () => [...(menuRef.current?.querySelectorAll<HTMLElement>("[role^=menuitem]") ?? [])];

  function openMenu(focus: "current" | "last" = "current") {
    setOpen(true);
    // Wait for the menu to render, then focus the checked product (or the last item for ArrowUp).
    requestAnimationFrame(() => {
      const all = items();
      const target = focus === "last" ? all.at(-1) : all.find((el) => el.getAttribute("aria-checked") === "true");
      (target ?? all[0])?.focus();
    });
  }

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  // Close when clicking or tabbing outside.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  function onButtonKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openMenu();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu("last");
    }
  }

  function onMenuKey(e: KeyboardEvent) {
    const all = items();
    const i = all.indexOf(document.activeElement as HTMLElement);
    const move = (n: number) => {
      e.preventDefault();
      all[(n + all.length) % all.length]?.focus();
    };
    if (e.key === "ArrowDown") move(i + 1);
    else if (e.key === "ArrowUp") move(i - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(all.length - 1);
    else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") setOpen(false);
  }

  return (
    <div ref={wrapRef} className="flex items-center gap-3">
      <span id={`${id}-label`} className="text-caption-14 text-grey-secondary">
        {label}
      </span>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? `${id}-menu` : undefined}
          aria-labelledby={`${id}-label ${id}-name`}
          onClick={() => (open ? close() : openMenu())}
          onKeyDown={onButtonKey}
          className={cx(
            "inline-flex h-pill items-center gap-1 rounded-full border bg-white-main pr-2 pl-3",
            "text-caption-14-bold text-grey-main cursor-pointer hover:border-grey-secondary hover:bg-bg-page",
            "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring",
            open ? "border-grey-secondary bg-bg-page" : "border-grey-tertiary",
          )}
        >
          <span id={`${id}-name`}>{current.name}</span>
          <Icon name="chevron-down" className="text-icon-xs" />
        </button>

        {open && (
          <div
            ref={menuRef}
            id={`${id}-menu`}
            role="menu"
            aria-label="Products"
            onKeyDown={onMenuKey}
            className="absolute top-full right-0 z-20 mt-1 flex min-w-menu flex-col rounded-md border border-grey-tertiary bg-white-main p-1 shadow-lg"
          >
            {state.products.map((p) => {
              const checked = p.id === current.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={checked}
                  tabIndex={-1}
                  onClick={() => {
                    setCurrentProduct(p.id);
                    close();
                  }}
                  className={cx(itemClass, checked && "font-semibold")}
                >
                  <span className="min-w-0 wrap-anywhere">{p.name}</span>
                  {checked && <Icon name="check" className="shrink-0 text-icon-xs text-blue-main" />}
                </button>
              );
            })}
            <div role="separator" className="my-1 h-px bg-grey-tertiary" />
            <Link href="/onboarding" role="menuitem" tabIndex={-1} className={itemClass} onClick={() => setOpen(false)}>
              Add product
            </Link>
            {showEdit && (
              <Link href="/products" role="menuitem" tabIndex={-1} className={itemClass} onClick={() => setOpen(false)}>
                Edit product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
