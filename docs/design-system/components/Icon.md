# Icon

The system's inline icons: 24px grid, 2px rounded stroke, colored with `currentColor`, sized by `font-size` (1em).

- Set: copy, check, refresh, loader, close, chevron-down, upload, file, pencil, sparkle, sparkles, alert (filled, for error messages).
- `sparkles` (three stars) marks AI actions, like the Rewrite button. Use it only where AI writes something.
- Decorative by default (`aria-hidden`). When an icon is the only content of a button, use IconButton, which adds the label.
- Placeholder set drawn for this system. Swap in Lucide or another library later if you prefer; the stroke style already matches.
