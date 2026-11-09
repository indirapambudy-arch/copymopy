// Saved demo results, in the same shape as the AI's reply (see docs/BRIEF.md, "Demo data and the AI").
// To switch on live AI later, replace findDemoResult with a call to a server route that returns a Reply.

import demo from "@/data/demo-results.json";
import type { ResultPart } from "@/components/ResultCard";
import type { ElementId } from "./elements";

export type { ResultPart };

export interface Option {
  approach: string;
  recommended: boolean;
  why: string;
  parts: ResultPart[];
}

/** What the AI sends back: three options and the facts it left out on purpose. */
export interface Reply {
  options: Option[];
  left_out: string[];
}

/** A saved Prompt lab run: the reply, plus the situation it was written for. */
export interface SavedResult {
  product: string;
  element: string;
  case: string;
  version: string;
  inputs: { what: string; next?: string; facts?: string };
  reply: Reply;
}

const saved: SavedResult[] = demo.results;

/** The saved run for this product and element, or undefined if there isn't one yet. */
export function findDemoResult(productId: string, element: ElementId): SavedResult | undefined {
  return saved.find((r) => r.product === productId && r.element === element);
}
