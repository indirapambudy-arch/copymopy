"use client";

import { useEffect, useRef, useState } from "react";
import { elements, getElement, defaultElementId, type ElementId, type QuestionKey } from "@/lib/elements";
import { demoProduct } from "@/lib/products";
import { findDemoResult, type Reply } from "@/lib/results";
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
  | { kind: "results"; reply: Reply }
  | { kind: "error" }
  /** No saved results for this element yet (slice 4 adds the other 8). */
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

    const reply = findDemoResult(product.id, element.id);
    if (!reply) {
      setScreen({ kind: "not-saved", elementLabel: element.label });
      return;
    }

    setScreen({ kind: "loading" });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setScreen(demoShouldFail() ? { kind: "error" } : { kind: "results", reply });
    }, DEMO_DELAY_MS);
  }

  // One live region for status changes, so screen readers hear each one once.
  const announcement =
    screen.kind === "loading" ? "Writing your copy…"
    : screen.kind === "results" ? "Three approaches are ready."
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
                <div className="flex flex-col gap-1">
                  <h2 className="text-subheading-18-bold">Three approaches</h2>
                  <p className="text-caption-14 text-grey-secondary">
                    {product.name}’s voice · Example results written by Claude while testing
                  </p>
                </div>
                {screen.reply.options.map((o) => (
                  <ResultCard
                    key={o.approach}
                    label={o.approach}
                    badge={o.recommended ? "Recommended" : undefined}
                    rationale={o.why}
                    parts={o.parts}
                  />
                ))}
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
                  This demo only has saved results for Error message so far. Pick Error message in the Element list
                  to see three approaches.
                </EmptyState>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
