"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { addProduct, useProducts } from "@/lib/products";
import { AppHeader } from "./AppHeader";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { AboutFields, VoiceFields, validateProduct, type ProductDraft, type ProductErrors } from "./ProductFields";

const empty: ProductDraft = { name: "", description: "", personality: [], notes: "" };

/** "Tell us about your product": the first screen for new visitors, and Add product from the menu. */
export function OnboardingScreen() {
  const router = useRouter();
  const snapshot = useProducts();
  const [draft, setDraft] = useState<ProductDraft>(empty);
  const [errors, setErrors] = useState<ProductErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  function change(patch: Partial<ProductDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
    // Clear an error as soon as its field is edited.
    setErrors((e) => ({
      name: "name" in patch ? undefined : e.name,
      description: "description" in patch ? undefined : e.description,
    }));
  }

  function submit() {
    const found = validateProduct(draft, true);
    if (found.name || found.description) {
      setErrors(found);
      (found.name ? nameRef : descriptionRef).current?.focus();
      return;
    }
    addProduct({ ...draft, name: draft.name.trim(), description: draft.description.trim(), notes: draft.notes.trim() });
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white-main">
      <AppHeader />
      <main className="flex grow justify-center px-4 pt-6 pb-8">
        <form
          aria-labelledby="onboarding-title"
          noValidate
          className="flex w-full max-w-onboarding flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {/* People who already have products came here from Add product, so give them a way back. */}
          {snapshot?.onboarded && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 self-start rounded-sm text-caption-14 text-grey-main hover:underline focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring"
            >
              <Icon name="arrow-left" className="text-icon-xs" />
              Back to writing
            </Link>
          )}
          <h1 id="onboarding-title" className="mb-2 text-center text-heading-24">
            Tell us about your product
          </h1>
          <AboutFields
            draft={draft}
            errors={errors}
            onChange={change}
            onboarding
            nameRef={nameRef}
            descriptionRef={descriptionRef}
          />
          <VoiceFields draft={draft} onChange={change} />
          <div className="mt-2 flex flex-col gap-3">
            <Button type="submit" size="lg" className="w-full">
              Continue
            </Button>
            <p className="text-center text-caption-12 text-grey-secondary">You can change these anytime</p>
          </div>
        </form>
      </main>
    </div>
  );
}
