// The 9 UI elements and the questions each one asks. Copy from docs/canvas/write-screen.html.
// The first question of every element is required; the rest say "(optional)".

export type ElementId =
  | "body" | "button" | "empty" | "error" | "headline"
  | "helper" | "success" | "toast" | "tooltip";

/** Which answer a question fills. The same key keeps its text when you switch elements. */
export type QuestionKey = "what" | "next" | "facts";

export interface Question {
  key: QuestionKey;
  label: string;
  placeholder: string;
  helper?: string;
}

export interface UIElement {
  id: ElementId;
  label: string;
  questions: Question[];
}

const facts: Question = {
  key: "facts",
  label: "What do we know for sure? (optional)",
  placeholder: "e.g. No money was taken. The cart is saved.",
  helper: "Copymopy only states facts you add here, so it never promises things your product doesn’t do.",
};

export const elements: UIElement[] = [
  {
    id: "body",
    label: "Body text",
    questions: [
      { key: "what", label: "What should this explain?", placeholder: "e.g. How expense approvals work for new managers" },
      { key: "next", label: "Key points to include (optional)", placeholder: "e.g. Approvals go to the right person automatically" },
    ],
  },
  {
    id: "button",
    label: "Button",
    questions: [{ key: "what", label: "What does the button do?", placeholder: "e.g. Saves the invoice as a draft" }],
  },
  {
    id: "empty",
    label: "Empty state",
    questions: [
      { key: "what", label: "What’s empty, and why?", placeholder: "e.g. A new account has no invoices yet" },
      { key: "next", label: "What can people do next? (optional)", placeholder: "e.g. Create their first invoice" },
    ],
  },
  {
    id: "error",
    label: "Error message",
    questions: [
      { key: "what", label: "What happened?", placeholder: "e.g. The card payment failed at checkout" },
      { key: "next", label: "What should people do next? (optional)", placeholder: "e.g. Try again or use another card" },
      facts,
    ],
  },
  {
    id: "headline",
    label: "Headline",
    questions: [
      { key: "what", label: "What’s the page or moment?", placeholder: "e.g. Welcome screen for new finance managers" },
      { key: "next", label: "Main benefit (optional)", placeholder: "e.g. Approvals take minutes, not days" },
    ],
  },
  {
    id: "helper",
    label: "Helper text",
    questions: [
      { key: "what", label: "Which field is it for?", placeholder: "e.g. Password" },
      { key: "next", label: "What do people get wrong? (optional)", placeholder: "e.g. Forgetting to add a number" },
    ],
  },
  {
    id: "success",
    label: "Success message",
    questions: [
      { key: "what", label: "What just happened?", placeholder: "e.g. A payment went through" },
      { key: "next", label: "What happens next? (optional)", placeholder: "e.g. A receipt is emailed" },
      facts,
    ],
  },
  {
    id: "toast",
    label: "Toast",
    questions: [{ key: "what", label: "What just happened?", placeholder: "e.g. An invoice was sent to the client" }],
  },
  {
    id: "tooltip",
    label: "Tooltip",
    questions: [{ key: "what", label: "What needs explaining?", placeholder: "e.g. What an approval limit is" }],
  },
];

export const defaultElementId: ElementId = "error";

export function getElement(id: string): UIElement {
  return elements.find((e) => e.id === id) ?? elements.find((e) => e.id === defaultElementId)!;
}
