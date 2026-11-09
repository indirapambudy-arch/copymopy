"use client";

import { useEffect, useRef, useState } from "react";
import { findRefinement, refineActions, type RefineAction, type ResultPart, type SavedResult } from "@/lib/results";
import { ResultCard } from "./ResultCard";

/** How long a card shows its refining placeholder before the saved variant. */
const REFINE_DELAY_MS = 900;

/** What one card shows right now: the original parts, or a refined version with its note. */
interface CardState {
  parts: ResultPart[];
  note?: string;
}

/**
 * The three result cards with refine, Undo and Copy. Refining changes only that card.
 * Undo is offered on one card at a time: the last one refined, back to what it showed before.
 * Give it a new `key` for each new result so everything starts fresh.
 */
export function ResultOptions({ result }: { result: SavedResult }) {
  const options = result.reply.options;
  // Cards and Undo change together, so they share one state.
  const [state, setState] = useState<{
    cards: Record<string, CardState>;
    undo: { approach: string; previous: CardState } | null;
  }>(() => ({ cards: Object.fromEntries(options.map((o) => [o.approach, { parts: o.parts }])), undo: null }));
  const { cards, undo } = state;
  const [refining, setRefining] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach(clearTimeout);
  }, []);

  function refine(approach: string, value: string) {
    const action = refineActions.find((a) => a.value === value);
    const variant = action && findRefinement(result, approach, action.value as RefineAction);
    if (!action || !variant) return;

    setRefining((r) => ({ ...r, [approach]: true }));
    setMessage(`Refining ${approach}…`);
    clearTimeout(timers.current[approach]);
    timers.current[approach] = setTimeout(() => {
      const next: CardState = { parts: variant.parts, note: variant.note ?? action.note };
      setState((s) => ({
        cards: { ...s.cards, [approach]: next },
        undo: { approach, previous: s.cards[approach] },
      }));
      setRefining((r) => ({ ...r, [approach]: false }));
      setMessage(`${approach} updated: ${next.note}.`);
    }, REFINE_DELAY_MS);
  }

  function undoLast() {
    if (!undo) return;
    setState((s) => ({ cards: { ...s.cards, [undo.approach]: undo.previous }, undo: null }));
    setMessage(`${undo.approach} is back to the previous version.`);
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
      {options.map((o) => (
        <ResultCard
          key={o.approach}
          label={o.approach}
          badge={o.recommended ? "Recommended" : undefined}
          rationale={o.why}
          parts={cards[o.approach].parts}
          note={cards[o.approach].note}
          refineOptions={refineActions}
          onRefine={(value) => refine(o.approach, value)}
          refining={refining[o.approach]}
          onUndo={undo?.approach === o.approach ? undoLast : undefined}
        />
      ))}
    </>
  );
}
