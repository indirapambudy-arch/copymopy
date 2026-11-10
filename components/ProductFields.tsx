"use client";

import { useId, type Ref } from "react";
import { maxPersonality, personalityOptions, type Product } from "@/lib/products";
import { Chip } from "./Chip";
import { TextArea } from "./TextArea";
import { TextField } from "./TextField";

export type ProductDraft = Omit<Product, "id">;

export interface ProductErrors {
  name?: string;
  description?: string;
}

/** Checks the two required fields. `onboarding` uses the friendlier wording from the onboarding canvas. */
export function validateProduct(draft: ProductDraft, onboarding = false): ProductErrors {
  const errors: ProductErrors = {};
  if (!draft.name.trim()) {
    errors.name = onboarding ? "Add your product’s name so you can find it later." : "Add a product name.";
  }
  if (!draft.description.trim()) errors.description = "Add a sentence about what it does and who uses it.";
  return errors;
}

/** The product's name and description: the "About the product" fields. */
export function AboutFields({
  draft, errors, onChange, onboarding = false, nameRef, descriptionRef,
}: {
  draft: ProductDraft;
  errors: ProductErrors;
  onChange: (patch: Partial<ProductDraft>) => void;
  onboarding?: boolean;
  nameRef?: Ref<HTMLInputElement>;
  descriptionRef?: Ref<HTMLTextAreaElement>;
}) {
  return (
    <>
      <TextField
        ref={nameRef}
        label="Product name"
        placeholder={onboarding ? "e.g. Ledgerly" : undefined}
        value={draft.name}
        error={errors.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <TextArea
        ref={descriptionRef}
        label="What does it do, and who uses it?"
        placeholder={
          onboarding
            ? "e.g. A B2B expense management tool. Our users are finance managers who need to approve employee expenses quickly."
            : undefined
        }
        helper={onboarding ? undefined : "This tells Copymopy the most about your product."}
        rows={3}
        value={draft.description}
        error={errors.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
    </>
  );
}

/** Brand personality chips (up to 3) and the voice notes. */
export function VoiceFields({
  draft, onChange,
}: {
  draft: ProductDraft;
  onChange: (patch: Partial<ProductDraft>) => void;
}) {
  const id = useId().replace(/:/g, "");
  const picked = draft.personality;
  const full = picked.length >= maxPersonality;
  return (
    <>
      <div role="group" aria-labelledby={`${id}-traits`} aria-describedby={`${id}-count`}>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span id={`${id}-traits`} className="text-caption-14 text-grey-main">
            Brand personality
          </span>
          <span id={`${id}-count`} aria-live="polite" className="text-caption-12 text-grey-secondary">
            {picked.length ? `${picked.length} of ${maxPersonality} picked` : `Pick up to ${maxPersonality}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {personalityOptions.map((t) => {
            const on = picked.includes(t);
            return (
              <Chip
                key={t}
                selected={on}
                disabled={!on && full}
                onClick={() => onChange({ personality: on ? picked.filter((x) => x !== t) : [...picked, t] })}
              >
                {t}
              </Chip>
            );
          })}
        </div>
      </div>
      <TextArea
        label="Anything else about your voice? (optional)"
        placeholder="e.g. We say “you”, not “users”. Never use jokes in errors."
        rows={3}
        value={draft.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
      />
    </>
  );
}
