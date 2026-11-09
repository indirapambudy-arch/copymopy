# Copymopy

Copymopy is a portfolio project: a web app where a product designer describes a UI moment and gets three different approaches to the copy, in their product's voice. Version 1 is a demo with saved Claude results. It makes no API calls and costs nothing to run.

## Read first

- `docs/BRIEF.md`: the build spec. Screens, data, build order (7 slices) and decisions. When documents disagree, the brief wins.
- `docs/design-system/`: the Copymopy design system. `tokens.json` and `tokens.css` are the source of truth for color, type, spacing, radius, borders and shadows. `components/*.md` describe each component's props, states and copy rules.
- `docs/design-system/reference/`: a working implementation of every component (`bundle.js` uses React.createElement, `bundle.css` holds the styles, `index.d.ts.txt` the props). Port these to typed React components with Tailwind; keep the same props and behavior.
- `docs/canvas/`: HTML from the design canvas for the Write, Onboarding and Products screens. Use them for layout, spacing and copy. Ignore the canvas-only tags (`x-dc`, `sc-if`, `sc-for`, `x-import`, `{{…}}` holes): read them as "show this when", "repeat this for" and "use this component".
- `prompts/write.md`: the tested Claude instructions (v-3500). Not used in v1; kept so live AI can be added later.

## How to work with me

I'm a product designer and new to coding, GitHub and the terminal.

- Do one slice from the brief per session, then stop and tell me how to check it.
- Before you change files, say in plain language what you're about to do and why.
- After each step, explain what each new file is for, in a sentence or two.
- When I need to do something myself (run a command, click something, check the browser), give me numbered steps.
- Don't commit or push. I'll commit and push with GitHub Desktop so I learn it. Tell me what to write as the commit message.
- Never add an API key, secret or paid service.

## Rules for the code

- Next.js (App Router) with TypeScript, Tailwind CSS. Keep dependencies to a minimum.
- Map every token to the Tailwind theme. No raw hex values or one-off sizes in components.
- Inter from Google Fonts (400, 600, 700 for the logo wordmark).
- Accessibility: visible focus (the `focus-ring` token), a label on every field, errors and loading announced, everything works by keyboard.
- Layout must work from 400px wide; the Write screen stacks to one column under 900px.
- Products and drafts are saved in localStorage. No database, no accounts.
- UI copy follows the voice in `docs/design-system/README.md`: sentence case, plain words, verbs on buttons, no exclamation marks, no emoji.
