// The Write screen's current draft (the chosen element and the answers), saved in this browser
// so a reload or a trip to the Products page doesn't lose it. Never sent anywhere.

import { getElement, defaultElementId, type ElementId, type QuestionKey } from "./elements";

export interface Draft {
  elementId: ElementId;
  answers: Partial<Record<QuestionKey, string>>;
}

const KEY = "copymopy:draft";
const empty: Draft = { elementId: defaultElementId, answers: {} };

/** The saved draft, or an empty one (on the server, on a first visit, or if storage is blocked). */
export function loadDraft(): Draft {
  if (typeof window === "undefined") return empty;
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as Partial<Draft> | null;
    if (!saved) return empty;
    const answers = Object.fromEntries(
      Object.entries(saved.answers ?? {}).filter(([, v]) => typeof v === "string"),
    ) as Draft["answers"];
    return { elementId: getElement(saved.elementId ?? "").id, answers };
  } catch {
    return empty;
  }
}

export function saveDraft(draft: Draft) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage full or blocked: the draft just isn't kept after a reload.
  }
}
