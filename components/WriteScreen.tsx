"use client";

import { useRef, useState } from "react";
import { elements, getElement, defaultElementId, type ElementId, type QuestionKey } from "@/lib/elements";
import { demoProduct } from "@/lib/products";
import { AppHeader } from "./AppHeader";
import { Button } from "./Button";
import { Dropdown } from "./Dropdown";
import { EmptyState } from "./EmptyState";
import { TextArea } from "./TextArea";

const elementOptions = elements.map((e) => ({ value: e.id, label: e.label }));

export function WriteScreen() {
  const product = demoProduct;
  const [elementId, setElementId] = useState<ElementId>(defaultElementId);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});
  const [error, setError] = useState("");
  const firstFieldRef = useRef<HTMLTextAreaElement>(null);

  const element = getElement(elementId);

  function write() {
    const main = answers.what ?? "";
    if (main.trim().length < 3) {
      setError("Add a few words so there’s something to work with.");
      firstFieldRef.current?.focus();
      return;
    }
    // Loading and saved results come in slice 3.
  }

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
                onChange={(e) => {
                  setElementId(getElement(e.target.value).id);
                  setError("");
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
                  error={i === 0 ? error : undefined}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }));
                    if (i === 0) setError("");
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-caption-14 text-grey-secondary">
                Using {product.name}’s voice:{" "}
                <b className="font-semibold text-grey-main">{product.personality.join(", ")}</b>
              </p>
              <Button type="submit" size="lg" icon="sparkles" className="w-full">
                Write copy
              </Button>
            </div>
          </form>
        </section>

        <section aria-label="Your copy" className="write-right">
          <div className="flex w-full flex-col gap-4">
            <EmptyState title="Your copy will show up here" headingLevel={2}>
              Pick an element, describe the situation, then select Write copy. You’ll get three different
              approaches to choose from.
            </EmptyState>
          </div>
        </section>
      </main>
    </div>
  );
}
