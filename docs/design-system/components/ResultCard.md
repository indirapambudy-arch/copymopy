# ResultCard

One generated copy option, with a copy button and optional refine actions. The Microcopy lab shows three, stacked.

- The eyebrow label ("Option 1") is caption-12-bold in grey-secondary. The copy itself is body-16 in grey-main.
- Copy button: on click, writes the text to the clipboard, then swaps to a green "Copied" check for 2 seconds. The "Copied" state is the same height as the copy button (36px), so the card never changes size. The swap is announced to screen readers.
- **Refine actions (optional):** pass `refineOptions` (e.g. Shorter, More casual, More formal, Try again) and `onRefine` to show small pill buttons under the text. They change this one option without regenerating the other two.
  - While refining, set `refining`: the text becomes a loading placeholder and the actions disable.
  - After refining, set `note` ("Shorter") to show what changed next to the label, and `onUndo` to offer Undo.
  - `allowCustom` adds an **Other** pill. It opens a one-line field ("What should change?") with Apply and Cancel; Enter applies, Escape cancels. Apply calls `onRefine('custom', text)`.
- **Character limit (optional):** pass `maxChars` to show "42 / 60 characters" under the text. Over the limit it turns red with an alert icon and says by how much ("· 6 over the limit"), so the warning never relies on color alone.
- **Parts (optional):** pass `parts` ([{ label, text }]) when the element has several pieces, like an error's Title, Body and Button. Each part shows its label in caption-12 grey-secondary above its text in body-16. Copy copies every part, one per paragraph. The character count is hidden in this mode.
- **Approach (optional):** use `label` for the approach ("Direct", "Reassuring", "Concise"), `badge` for a pill like "Recommended", and `rationale` for one line under the copy saying why you'd pick it. The rationale has a sparkle icon in blue-main and grey-secondary 14px text.
- Without `refineOptions`, `allowCustom` or `maxChars` the card looks exactly as before.
- White card, 1px grey-tertiary border, radius-md, 16px padding. No shadow: cards sit flat on the page.
- The consumer supplies `label` and `text` and does the refining. `onCopy` is for analytics or a Toast.
