"use client";

import { useEffect, useRef, useState } from "react";
import { elements, getElement, defaultElementId, type ElementId, type QuestionKey } from "@/lib/elements";
import { demoProduct } from "@/lib/products";
import { findDemoResult, type SavedResult } from "@/lib/results";
import { AppHeader } from "./AppHeader";
import { Button } from "./Button";
import { Dropdown } from "./Dropdown";
import { EmptyState } from "./EmptyState";
import { ResultCard } from "./ResultCard";
import { ResultSkeleton } from "./ResultSkeleton";
import { TextArea } from "./TextArea";

const elementOptions = elements.map((e) => ({ value: e.id, label: e.label }));

/** How long the demo shows the loading state before the saved results. */
const DEMO_DELAY_MS = 1500;

type Screen =
  | { kind: "empty" }
  | { kind: "loading" }
  | { kind: "results"; result: SavedResult }
  | { kind: "error" }
  /** No saved results for this product and element (a fallback for products added in slice 6). */
  | { kind: "not-saved"; elementLabel: string };

/** Add ?demo=error to the address to see the error state; nothing can really fail in the demo. */
function demoShouldFail() {
  return new URLSearchParams(window.location.search).get("demo") === "error";
}

export function WriteScreen() {
  const product = demoProduct;
  const [elementId, setElementId] = useState<ElementId>(defaultElementId);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});
  const [fieldError, setFieldError] = useState("");
  const [screen, setScreen] = useState<Screen>({ kind: "empty" });
  const firstFieldRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const element = getElement(elementId);
  const isLoading = screen.kind === "loading";

  function write() {
    if (isLoading) return;
    const main = answers.what ?? "";
    if (main.trim().length < 3) {
      setFieldError("Add a few words so there’s something to work with.");
      firstFieldRef.current?.focus();
      return;
    }

    const result = findDemoResult(product.id, element.id);
    if (!result) {
      setScreen({ kind: "not-saved", elementLabel: element.label });
      return;
    }

    setScreen({ kind: "loading" });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setScreen(demoShouldFail() ? { kind: "error" } : { kind: "results", result });
    }, DEMO_DELAY_MS);
  }

  // One live region for status changes, so screen readers hear each one once.
  const announcement =
    screen.kind === "loading" ? "Writing your copy…"
    : screen.kind === "results" ? "Your copy is ready: three options."
    : "";

  return (
    <div className="flex min-h-screen flex-col bg-white-main">
      <AppHeader productName={product.name} />

      <main className="flex grow flex-wrap items-stretch">
        <section aria-labelledby="write-title" className="write-left">
          <form
            className="flex w-full max-w-form flex-col gap-6"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              write();
            }}
          >
            <h1 id="write-title" className="text-heading-28">
              Start writing
            </h1>

            <div className="w-full max-w-field">
              <Dropdown
                label="Element"
                options={elementOptions}
                value={elementId}
                disabled={isLoading}
                onChange={(e) => {
                  setElementId(getElement(e.target.value).id);
                  setFieldError("");
                }}
              />
            </div>

            <div className="flex flex-col gap-4">
              {element.questions.map((q, i) => (
                <TextArea
                  key={`${element.id}-${q.key}`}
                  ref={i === 0 ? firstFieldRef : undefined}
                  label={q.label}
                  placeholder={q.placeholder}
                  helper={q.helper}
                  rows={i === 0 ? 3 : 2}
                  value={answers[q.key] ?? ""}
                  error={i === 0 ? fieldError : undefined}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }));
                    if (i === 0) setFieldError("");
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-caption-14 text-grey-secondary">
                Using {product.name}’s voice:{" "}
                <b className="font-semibold text-grey-main">{product.personality.join(", ")}</b>
              </p>
              <Button type="submit" size="lg" icon="sparkles" loading={isLoading} className="w-full">
                Write copy
              </Button>
            </div>
          </form>
        </section>

        <section aria-label="Your copy" aria-busy={isLoading || undefined} className="write-right">
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>

          <div className="flex w-full flex-col gap-4">
            {screen.kind === "empty" && (
              <EmptyState title="Your copy will show up here" headingLevel={2}>
                Pick an element, describe the situation, then select Write copy. You’ll get three different
                approaches to choose from.
              </EmptyState>
            )}

            {screen.kind === "loading" && (
              <>
                <h2 className="text-subheading-18-bold">Writing your copy…</h2>
                {[0, 1, 2].map((i) => (
                  <ResultSkeleton key={i} />
                ))}
              </>
            )}

            {screen.kind === "results" && (
              <>
                <h2 className="text-subheading-18-bold">Three ways to say it</h2>

                {screen.result.reply.options.map((o) => (
                  <ResultCard
                    key={o.approach}
                    label={o.approach}
                    badge={o.recommended ? "Recommended" : undefined}
                    rationale={o.why}
                    parts={o.parts}
                  />
                ))}

                {screen.result.reply.left_out.length > 0 && (
                  <section aria-labelledby="left-out-title" className="flex flex-col gap-2 pt-2">
                    <h3 id="left-out-title" className="text-caption-14-bold text-grey-main">
                      Left out on purpose
                    </h3>
                    <ul className="flex list-disc flex-col gap-1 pl-4 text-caption-14 text-grey-secondary">
                      {screen.result.reply.left_out.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Required by the brief's Honesty rule: say these are saved examples, and nothing is sent. */}
                <p className="text-caption-12 text-grey-secondary">
                  Saved examples written by Claude. Your text stays in your browser.
                </p>
              </>
            )}

            {screen.kind === "error" && (
              <div role="alert">
                <EmptyState
                  title="Couldn’t write this"
                  icon="alert"
                  tone="error"
                  headingLevel={2}
                  action={
                    <Button variant="secondary" icon="refresh" onClick={write}>
                      Try again
                    </Button>
                  }
                >
                  Something went wrong on our side. Your text and settings are still here, so you can try again.
                </EmptyState>
              </div>
            )}

            {screen.kind === "not-saved" && (
              <div role="status">
                <EmptyState title={`No saved examples for ${screen.elementLabel} yet`} headingLevel={2}>
                  This demo has saved results for {product.name} only for some elements. Pick another element to
                  see three approaches.
                </EmptyState>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
