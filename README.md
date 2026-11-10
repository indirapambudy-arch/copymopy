# Copymopy

A UX writing assistant for product designers. Describe a UI moment, like a failed payment or an empty invoice list, and get three different approaches to the copy, written in your product's voice.

A portfolio project by Indira Pambudy, built with Claude Code.

## How it works

1. **Set up a product.** Give it a name, say what it does and who uses it, and pick up to three personality traits, like Calm, Clear and Direct.
2. **Describe the moment.** Pick one of 9 UI elements (error message, empty state, button, toast and more) and answer two or three short questions.
3. **Get three approaches.** Each option has a name, like Direct, Reassuring or Concise, one line on when you'd pick it, and its copy split into parts, such as Title, Body and Button. One is marked Recommended.
4. **Refine and copy.** Make one option shorter, more casual or more formal, or try again, without changing the other two. Undo if you prefer the last version. Copy puts every part on the clipboard.

Under the results, "Left out on purpose" lists facts the copy avoids promising, like refunds or timelines nobody confirmed.

## A demo with real results, at no cost

Version 1 makes no AI calls. Every result on the site is real Claude output, saved from the Prompt lab, where the instructions were tested and each run scored (version v-3500, in `prompts/write.md`). The site says so in a note under the results.

- **Honest:** the site never implies it's processing your text. It shows saved examples and says that they are.
- **Private:** nothing you type leaves your browser. Products and your current draft are kept in your browser's storage. There are no accounts, no database and no tracking.
- **Free to run:** no API key, no paid services.

The saved results use the same shape as the AI's reply, so live AI can be switched on later without redesigning anything.

Saved results exist for Ledgerly (all 9 elements) and Pawpal (error messages). A product you add yourself shows a note pointing to those two.

## Accessibility

- Every control has a visible focus ring and works by keyboard, including the product menu, refine actions, Undo and Copy.
- Every field has a label. Errors and loading are announced to screen readers.
- Text meets WCAG AA contrast.
- Layouts work from 400px wide, and the Write screen stacks to one column under 900px.

## Built with

- Next.js (App Router), TypeScript and Tailwind CSS, with no other runtime dependencies.
- The Copymopy design system in `docs/design-system/`. Every color, size and spacing comes from its tokens.
- Deployed on Vercel.

## Run it yourself

You need [Node.js](https://nodejs.org) 20 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project map

| Where | What |
| --- | --- |
| `docs/BRIEF.md` | The build spec: screens, data, build order and decisions |
| `docs/design-system/` | Tokens and component docs |
| `docs/canvas/` | Screen designs from the design canvas |
| `prompts/write.md` | The tested Claude instructions, kept for when live AI is added |
| `data/demo-results.json` | Saved Claude results. Rebuild with `npm run demo-data` |
| `data/demo-refinements.json` | Saved Shorter, More casual, More formal and Try again versions |
