"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { currentProduct, updateProduct, useProducts, type Product } from "@/lib/products";
import { AppHeader } from "./AppHeader";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { ProductMenu } from "./ProductMenu";
import { AboutFields, VoiceFields, validateProduct, type ProductDraft, type ProductErrors } from "./ProductFields";
import { Toast } from "./Toast";

const TOAST_MS = 4000;

function toDraft(p: Product): ProductDraft {
  return { name: p.name, description: p.description, personality: [...p.personality], notes: p.notes };
}

function sameDraft(a: ProductDraft, b: ProductDraft) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Edit the current product: About the product, Voice, and a save bar that's always at the bottom. */
export function ProductsScreen() {
  const router = useRouter();
  const snapshot = useProducts();
  // Unsaved edits per product, so switching products in the menu keeps them until you discard.
  const [drafts, setDrafts] = useState<Record<string, ProductDraft>>({});
  const [errors, setErrors] = useState<ProductErrors>({});
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (snapshot && !snapshot.onboarded) router.replace("/onboarding");
  }, [snapshot, router]);

  if (!snapshot?.onboarded) return <div className="min-h-screen bg-white-main" />;

  const product = currentProduct(snapshot.state);
  const saved = toDraft(product);
  const draft = drafts[product.id] ?? saved;
  const dirty = !sameDraft(draft, saved);

  function change(patch: Partial<ProductDraft>) {
    setDrafts((d) => ({ ...d, [product.id]: { ...draft, ...patch } }));
    setErrors((e) => ({
      name: "name" in patch ? undefined : e.name,
      description: "description" in patch ? undefined : e.description,
    }));
  }

  function discard() {
    setDrafts(({ [product.id]: _, ...rest }) => rest);
    setErrors({});
    // Discard disappears once used, so keep keyboard focus in the save bar.
    saveRef.current?.focus();
  }

  function save() {
    const found = validateProduct(draft);
    if (found.name || found.description) {
      setErrors(found);
      (found.name ? nameRef : descriptionRef).current?.focus();
      return;
    }
    const next = { ...draft, name: draft.name.trim(), description: draft.description.trim(), notes: draft.notes.trim() };
    updateProduct({ ...next, id: product.id });
    setDrafts(({ [product.id]: _, ...rest }) => rest);
    setToast(`${next.name} saved`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), TOAST_MS);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white-main">
      <AppHeader>
        <ProductMenu
          label="Product"
          state={snapshot.state}
          showEdit={false}
        />
      </AppHeader>

      <main className="grow px-4 py-8 split:px-8">
        <div className="mx-auto flex max-w-layout flex-col gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start rounded-sm text-caption-14 text-grey-main hover:underline focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-focus-ring"
          >
            <Icon name="arrow-left" className="text-icon-xs" />
            Back to writing
          </Link>

          <form
            id="product-form"
            noValidate
            aria-labelledby="products-title"
            className="flex w-full max-w-product-form min-w-0 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <div>
              <h1 id="products-title" className="text-heading-28 wrap-anywhere">
                {product.name}
              </h1>
              <p className="mt-2 text-body-16 text-grey-secondary">
                Copymopy will use this voice for every rewrite, so you never have to explain {product.name} again.
              </p>
            </div>

            <section aria-labelledby="products-about" className="flex flex-col gap-6 pt-8">
              <div>
                <h2 id="products-about" className="text-subheading-18-bold">
                  About the product
                </h2>
                <p className="mt-1 text-caption-14 text-grey-secondary">The more specific, the better the copy.</p>
              </div>
              <AboutFields
                draft={draft}
                errors={errors}
                onChange={change}
                nameRef={nameRef}
                descriptionRef={descriptionRef}
              />
            </section>

            <section
              aria-labelledby="products-voice"
              className="mt-8 flex flex-col gap-6 border-t border-grey-tertiary py-8"
            >
              <div>
                <h2 id="products-voice" className="text-subheading-18-bold">
                  Voice
                </h2>
                <p className="mt-1 text-caption-14 text-grey-secondary">How {product.name} should sound.</p>
              </div>
              <VoiceFields draft={draft} onChange={change} />
            </section>

          </form>
        </div>
      </main>

      {/* Always at the bottom of the window: sticky while the form scrolls, and pushed down when it's short. */}
      <div
        role="region"
        aria-label="Save"
        className="sticky bottom-0 z-10 border-t border-grey-tertiary bg-white-main px-4 py-3 split:px-8"
      >
        <div className="mx-auto flex max-w-layout flex-wrap items-center justify-end gap-2">
          {dirty && (
            <p className="mr-auto flex items-center gap-2 text-caption-14-bold text-grey-main">
              <span aria-hidden="true" className="size-2 rounded-full bg-blue-main" />
              Unsaved changes
            </p>
          )}
          {dirty && (
            <Button variant="ghost" onClick={discard}>
              Discard
            </Button>
          )}
          <Button ref={saveRef} type="submit" form="product-form">
            Save changes
          </Button>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
