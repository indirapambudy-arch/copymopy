# Button

Primary is the main action of a view; use it once per screen (in the Microcopy lab, "Generate").

- **Variants:** `primary` (blue-main fill, from Figma), `secondary` (outlined, added for "Regenerate"), `ghost` (text only, added for "Clear").
- **Sizes:** `lg` 44px, `md` 36px (default), `sm` 28px. Sizes are read from the Figma screenshots. Use `lg` on touch screens.
- **States:** hover blue-hover, pressed blue-clicked, focus uses the `focus-ring` token (white gap + blue ring), disabled blue-disabled. `loading` swaps the label for a spinner on blue-disabled, as in Figma, and keeps the label for screen readers.
- **Copy:** verb first, sentence case: "Generate", "Copy all", "Try again".
- The consumer supplies the label and `onClick`.
