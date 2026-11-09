# Copymopy build brief

Nov 9, 2026 · Indira Pambudy. Living version: https://claude.ai/artifact/RLUe27uHyfQXziaPKT6Sit

## What we're building

Copymopy is a web app where a product designer describes a UI moment and gets three different approaches to the copy, written in their product's voice. Version 1 is a demo: every result on the site is real Claude output saved from the Prompt lab, so the site costs nothing to run. This brief is the spec Claude Code builds from, in small slices, each one live on Vercel.

Done means:

- A public URL where someone can set up a product, pick any of the 9 elements, see three approaches, refine one option and copy it.
- Results are real Claude output from the Prompt lab (instructions version v-3500), saved as demo data. No API key, no running costs.
- The site says so plainly, in one note under the results: "Saved examples written by Claude. Your text stays in your browser."
- It matches the Copymopy design system and the canvas, works at phone width and passes basic accessibility checks.
- The data shape matches the AI's reply shape, so live AI can be switched on later without redesigning anything.

Out of scope for v1: live AI calls, pasting existing copy to improve, screenshot context, accounts and login, a database, team sharing, history across devices. Products are saved in the browser.

## Stack

| Part | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router), TypeScript | Standard for portfolio-grade web apps; easy to add a server route later |
| Styling | Tailwind CSS, theme built from the Copymopy tokens | Tokens map one to one to Tailwind colors, spacing, radius and type |
| Results | A JSON file of saved Claude results (`data/demo-results.json`) | Real output, zero cost |
| Saving | Browser localStorage for products and the current draft | No accounts or database in v1 |
| Hosting | Vercel, free Hobby plan, connected to the GitHub repo | Every push to main deploys; every branch gets a preview link |
| Code | GitHub repo indirapambudy-arch/copymopy | Portfolio link |

## Design system

Source of truth: `docs/design-system/` (tokens.json, tokens.css, README.md, components/*.md) and the working reference implementation in `docs/design-system/reference/`. Rebuild the components in React + Tailwind with the same props.

Components, in the order the slices need them:

| Component | Notes |
| --- | --- |
| Button | primary, secondary, ghost; lg, md, sm; loading state; optional icon |
| IconButton | required label (aria-label and tooltip) |
| TextField, TextArea | label, helper, error, optional counter |
| Dropdown | native select, placeholder, max width 400px for Element |
| Chip | checkbox chips for brand personality, max 3 picked |
| ResultCard | parts (Title / Body / Button), badge ("Recommended"), rationale, refine actions, Undo, Copy with a Copied state the same height as the button |
| ResultSkeleton, EmptyState, Toast | loading, empty and saved states |
| Icon, Logo | the 12 stroke icons; Logo lockup and mark |
| Product menu | the "Writing for" pill and its menu (products with a check on the current one, then Add product and Edit product). Built in the canvas (docs/canvas/write-screen.html), not yet in the design system |

Uploader is not needed in v1.

## Screens and states

Layouts and copy are in `docs/canvas/`.

| Screen | What's on it | States |
| --- | --- | --- |
| Onboarding | Product name and "What does it do, and who uses it?" (both required), Brand personality chips (up to 3), "Anything else about your voice? (optional)", Continue, "You can change these anytime" | Empty, error on a missing required field, filled |
| Write | Header with Logo and the "Writing for" product menu. Left (white): "Start writing", Element dropdown, questions that change with the element, voice line ("Using Ledgerly's voice: Calm, Clear, Direct · Edit"), Write copy. Right (grey): results | Empty ("Your copy will show up here"), loading, results, error |
| Results | Heading "Three ways to say it", then three approach cards: name, Recommended pill on one, parts with labels, one-line reason, refine actions (Shorter, More casual, More formal, Try again), Undo, Copy. "Left out on purpose", then the demo note in small grey text. No other lines under the heading | Refining one card, copied |
| Products | Product menu in the header. About the product (name and description, both required) and Voice (personality chips, notes). Save bar always at the bottom with Save changes; "Unsaved changes" and Discard appear when something changed | Saved, unsaved changes, saved toast |

Navigation: Onboarding → Write. The product menu switches products, opens Add product (onboarding) and Edit product (Products). Products → Back to writing.

## Demo data and the AI

Version 1 makes no API calls. Write copy shows the loading state for about 1.5 seconds, then the saved results for the selected element and product. A small note after the results says "Saved examples written by Claude. Your text stays in your browser."

How the demo data is collected, at no cost:

1. In the Prompt lab, run at least one case per element for Ledgerly, plus the two Pawpal cases. Score each run.
2. Rerun any element whose results wouldn't ship.
3. Copy the log and paste it into Claude Code, which turns the best run per element into `data/demo-results.json`.
4. For the refine actions (Shorter, More casual, More formal, Try again), Claude Code writes one variant per action for each option, following `prompts/write.md`. Stored in the same file.

When a visitor types their own situation, show the saved results for that element. The demo note above covers both points (saved examples, nothing sent).

Elements, their parts, length guidance and questions:

| Element | Parts | Length | Questions (first one required) |
| --- | --- | --- | --- |
| Body text | Body | 1–3 short sentences | What should this explain? · Key points to include (optional) |
| Button | Label | 1–3 words, starts with a verb | What does the button do? |
| Empty state | Heading, Body, Button | Heading under 6 words, body one sentence | What's empty, and why? · What can people do next? (optional) |
| Error message | Title, Body, Button | Title under 6 words, body 1–2 sentences | What happened? · What should people do next? (optional) · What do we know for sure? (optional) |
| Headline | Headline | Under 8 words | What's the page or moment? · Main benefit (optional) |
| Helper text | Text | One short line | Which field is it for? · What do people get wrong? (optional) |
| Success message | Title, Body | Title under 5 words, body one sentence | What just happened? · What happens next? (optional) · What do we know for sure? (optional) |
| Toast | Message | Under 40 characters | What just happened? |
| Tooltip | Text | One sentence, doesn't repeat the label | What needs explaining? |

Each saved result uses the same shape as the AI's reply:

```json
{"options":[{"approach":"Direct","recommended":true,"why":"…","parts":[{"label":"Title","text":"…"}]}],"left_out":["…"]}
```

Because the shapes match, switching on live AI later is one slice: a server route that sends `prompts/write.md` plus the context to the Claude API and returns this JSON. Show `left_out` under the results as "Left out on purpose".

## Build order

Each slice ends with a commit, a push and a working Vercel link. One slice per session.

1. **Foundation.** Next.js + Tailwind, tokens in the Tailwind theme, Inter loaded, Button, IconButton, Icon, Logo. Deploy the empty app to Vercel.
2. **Static Write screen.** Header, Element dropdown, questions per element, voice line, Write copy, the empty state.
3. **Demo results for Error messages.** `data/demo-results.json` with the Error message results, ResultCard with parts, badge and reason, the loading and error states.
4. **All elements.** Saved results for the other 8 elements, plus `left_out` under the results and the demo note. `npm run demo-data` rebuilds `data/demo-results.json` from the Prompt lab log in `data/prompt-lab-log.json`.
5. **Refine.** Saved variants for Shorter, More casual, More formal and Try again, Undo on one card at a time; Copy with the Copied state.
6. **Products.** Onboarding, the product menu, the Products page with the save bar. Name and description are required. Saved in localStorage.
7. **Polish.** Everything in Guardrails, then a final deploy.

Before slice 3, collect the demo data in the Prompt lab.

## Guardrails

Running costs are zero: no API key, free Vercel and GitHub plans, and Claude Code runs on the existing Claude subscription.

| Area | Rule |
| --- | --- |
| Honesty | Say on the site that results are saved examples written by Claude (the demo note under the results). Never imply a visitor's text is being processed. |
| Privacy | Nothing a visitor types leaves their browser. |
| Accessibility | Visible focus on every control, labels on every field, errors announced, loading announced, Copy works by keyboard, contrast as in the design system's notes. |
| Mobile | Write stacks to one column under 900px; the save bar and menus stay usable at 400px wide. |

## Decisions (9 Nov)

- Demo-only for v1: no API key and no spending.
- Industry and Company type are removed. Product name and "What does it do, and who uses it?" are required, on onboarding and on Products.
- "Paste it to improve" moves to a later version.
- No screenshot context in v1.
- The design system README still mentions tone chips and pasting copy; those predate these decisions. Follow this brief.
- Results header simplified: the heading is "Three ways to say it" with nothing under it. The voice line, the "written for" line and the two demo lines were removed; one note after "Left out on purpose" keeps the Honesty rule.
