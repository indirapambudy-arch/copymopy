# TextField

A single-line input with a label above, and optional helper text, error message and character counter below, matching the Figma input set.

- **States:** default, hover (border goes grey-secondary), focus (2px blue-main), error (2px red-main, alert icon, red message), disabled (grey-bgdisabled fill, grey-textdisabled text).
- `error` replaces `helper`. Write errors that say how to fix the problem: "Enter a full address, like https://…", not "Invalid input".
- `maxLength` shows the "n / max" counter on the right, as in Figma.
- Always pass a visible `label`; placeholders are examples, not labels.
- 40px tall, radius-sm, 12px side padding, 16px text.
