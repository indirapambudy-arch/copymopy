// Saved demo results, in the same shape as the AI's reply (see docs/BRIEF.md, "Demo data and the AI").
// To switch on live AI later, replace findDemoResult with a call to a server route that returns a Reply.

import demo from "@/data/demo-results.json";
import demoRefinements from "@/data/demo-refinements.json";
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

/** The refine actions under each result card, in order. `note` shows after the approach name once applied. */
export const refineActions = [
  { value: "shorter", label: "Shorter", note: "Shorter" },
  { value: "casual", label: "More casual", note: "More casual" },
  { value: "formal", label: "More formal", note: "More formal" },
  { value: "again", label: "Try again", note: "New version" },
] as const;

export type RefineAction = (typeof refineActions)[number]["value"];

/** A refined version of one option. `note` replaces the action's note when set. */
export interface Refinement {
  parts: ResultPart[];
  note?: string;
}

const refinements: Record<string, Record<string, Record<string, Refinement>>> = demoRefinements.refinements;

/**
 * The saved variant for one option and refine action (data/demo-refinements.json), always made from the
 * original option. To switch on live AI later, replace this with a call that sends the option and the action.
 */
export function findRefinement(
  result: Pick<SavedResult, "product" | "element">,
  approach: string,
  action: RefineAction,
): Refinement | undefined {
  return refinements[`${result.product}/${result.element}`]?.[approach]?.[action];
}
