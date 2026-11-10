"use client";

// Products and their voice, saved in this browser (localStorage). No accounts, no database.
// Ledgerly and Pawpal come pre-filled, because they are the products with saved Claude results.

import { useSyncExternalStore } from "react";

export interface Product {
  id: string;
  name: string;
  /** What does it do, and who uses it? */
  description: string;
  /** Brand personality, up to 3. */
  personality: string[];
  /** Anything else about the voice (optional). */
  notes: string;
}

/** The personality chips, from docs/canvas/onboarding.html. */
export const personalityOptions = [
  "Calm", "Clear", "Direct", "Confident", "Formal", "Friendly", "Warm", "Empathetic", "Playful",
];
export const maxPersonality = 3;

/** The demo products, with the voices from docs/canvas/products.html. */
export const seedProducts: Product[] = [
  {
    id: "ledgerly",
    name: "Ledgerly",
    description:
      "A B2B expense management tool. Our users are finance managers who need to approve employee expenses quickly, often on their phone.",
    personality: ["Calm", "Clear", "Direct"],
    notes: "Never jokey. We say “you”, not “users”.",
  },
  {
    id: "pawpal",
    name: "Pawpal",
    description:
      "An app for booking dog walkers and sitters. Our users are busy dog owners who often book last minute.",
    personality: ["Warm", "Playful"],
    notes: "Short sentences.",
  },
];

export interface ProductState {
  products: Product[];
  currentId: string;
}

/**
 * What a page sees: `null` while the page is still loading in the browser,
 * `{ onboarded: false }` before someone has finished onboarding, otherwise the saved products.
 */
export type ProductSnapshot = null | { onboarded: false; state: ProductState } | { onboarded: true; state: ProductState };

const KEY = "copymopy:products";
const EVENT = "copymopy:products-changed";
const seedState: ProductState = { products: seedProducts, currentId: seedProducts[0].id };

let cachedRaw: string | null | undefined;
let cachedSnapshot: ProductSnapshot = null;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // Storage blocked (private mode, settings): behave like a first visit.
  }
}

function parse(raw: string | null): ProductSnapshot {
  if (raw) {
    try {
      const state = JSON.parse(raw) as ProductState;
      if (Array.isArray(state.products) && state.products.length > 0) {
        const currentId = state.products.some((p) => p.id === state.currentId) ? state.currentId : state.products[0].id;
        return { onboarded: true, state: { products: state.products, currentId } };
      }
    } catch {
      // Unreadable data: start again.
    }
  }
  return { onboarded: false, state: seedState };
}

function getSnapshot(): ProductSnapshot {
  const raw = readRaw();
  // Same text, same object: React only re-renders when the saved data really changed.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = parse(raw);
  }
  return cachedSnapshot;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // Changes made in another tab.
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The saved products, kept in sync across the app and other tabs. */
export function useProducts(): ProductSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

function write(state: ProductState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the change lasts until the page reloads.
    cachedRaw = JSON.stringify(state);
    cachedSnapshot = { onboarded: true, state };
  }
  window.dispatchEvent(new Event(EVENT));
}

function current(): ProductState {
  return (getSnapshot() ?? { state: seedState }).state;
}

/** Adds a product (from onboarding) and makes it the current one. Returns its id. */
export function addProduct(product: Omit<Product, "id">): string {
  const id = `product-${Date.now().toString(36)}`;
  const { products } = current();
  write({ products: [...products, { ...product, id }], currentId: id });
  return id;
}

/** Saves changes to an existing product (from the Products page). */
export function updateProduct(product: Product) {
  const state = current();
  write({ ...state, products: state.products.map((p) => (p.id === product.id ? product : p)) });
}

/** Switches the product you're writing for. */
export function setCurrentProduct(id: string) {
  const state = current();
  if (state.products.some((p) => p.id === id)) write({ ...state, currentId: id });
}

export function currentProduct(state: ProductState): Product {
  return state.products.find((p) => p.id === state.currentId) ?? state.products[0];
}
