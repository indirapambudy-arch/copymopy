// A product and its voice. In slice 6 these are created on onboarding and saved in localStorage;
// until then the Write screen uses the Ledgerly demo product.

export interface Product {
  id: string;
  name: string;
  /** What does it do, and who uses it? */
  description: string;
  /** Brand personality, up to 3. */
  personality: string[];
  /** Anything else about the voice (optional). */
  notes?: string;
}

export const demoProduct: Product = {
  id: "ledgerly",
  name: "Ledgerly",
  description: "Expense and invoice software for small finance teams.",
  personality: ["Calm", "Clear", "Direct"],
};
