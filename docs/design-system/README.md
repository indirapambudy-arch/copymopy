# Copymopy — design system

Copymopy is the design system for the Microcopy lab, a small AI tool for product copy. You describe the copy you need or paste copy to rewrite, pick a tone, and get three options to copy. The UI is calm and utilitarian: one blue for action, greys for everything else, Inter throughout. The copy it generates is the star, so the interface stays out of its way.

## Voice

- Plain, direct, sentence case. Verbs on buttons: "Generate", "Copy", "Try again".
- Errors say what happened and how to fix it, without apologies: "Add a few words so there's something to work with."
- Empty states point to the next step, not to the emptiness.
- No exclamation marks, no emoji.

## Visual foundations

- **Color.** `blue-main` is the only accent and means "you can act here": the primary button, focus, the selected tone chip. Hover and pressed get darker (`blue-hover`, `blue-clicked`). Text is `grey-main`; supporting text is `grey-secondary`. `red-main` is only for errors and `green-main` only for "Copied". The app sits on `bg-page` with white (`white-main`) cards and fields.
- **Type.** Inter, regular (400) and semibold (600). Sizes run caption-12 → heading-32. Generated copy is set in body-16 so it reads like real UI text.
- **Shape.** Controls are square-ish (`radius-sm`, 4px), cards are softer (`radius-md`, 8px), and tone chips are the one round shape (`radius-full`). That makes the tone choice easy to spot.
- **Depth.** Flat. Borders (`grey-tertiary`, `border-default`) separate things; `shadow-lg` is only for things that float, like the toast.
- **Spacing.** 4px base: `space-1` to `space-8`. Cards use 16px padding; form groups are 24px apart.
- **Focus.** Every control shows a visible focus state. Buttons and chips use `focus-ring` (a 2px white gap, then 2px of blue-main). Fields use a 2px blue-main border.

## Accessibility notes

- `grey-secondary` is #707070, darkened from Figma's #797979, which was 4.35:1 on white and failed AA for the 12px helper text. It's now 4.9:1 on white and 4.5:1 on bg-page.
- `grey-tertiary` borders are 1.5:1 on white, below the 3:1 WCAG asks for control boundaries. Fields still work because they always have a visible label, but consider a darker border (around #8a8a8a, 3.4:1) if you want to pass 1.4.11 strictly.
- Selected chips have no icon: they change fill and text color and get a 2px border, so the thicker border tells them apart without relying on color.

## Logo

A rounded blue-main square holding three white pills, for the three options every generation gives, next to the "Copymopy" wordmark in Inter Bold. The pills echo the tone chips. Use the `Logo` component: the lockup in headers at 28–32px, the mark alone for icons, `inverse` on blue-main or dark grounds. Image files are in the Logos asset group.

## Iconography

Inline stroke icons on a 24px grid, 2px rounded stroke, colored with `currentColor`: copy, check, refresh, loader, close, chevron-down, upload, file, pencil, sparkle, sparkles (for AI actions), alert. They're available as the `Icon` component. This is a placeholder set; swap in Lucide later if you like, since the style matches.

## What came from Figma, and what was added

- **From Figma (exported tokens):** all colors, the Inter type scale. **From the screenshots:** Primary button sizes and states, TextField, TextArea and Dropdown states, 4px radius, focus style, page background.
- **Added for the Microcopy lab:** secondary and ghost buttons, IconButton, Chip and ChipGroup (tone picker), ResultCard, ResultSkeleton, Toast, EmptyState, Uploader, the icon set, and the `blue-soft`, `green-main`, spacing, radius, border-width and shadow tokens.
- **Not synced:** a dark theme (none in the file). `body-16-bold` keeps Figma's 20px line height against `body-16`'s 22px; check whether that's intended.
