# ChipGroup

The tone picker: a labelled, single-select group of chips. One tone is always selected.

- Built as a radio group. Tab moves into the group, the arrow keys move and select, and screen readers announce "Tone, radio group, Friendly, selected".
- Selected chip: blue-soft fill, 2px blue-main border and blue-main text, with no icon. The thicker border is the cue that doesn't rely on color alone, and screen readers announce the selection.
- Keep labels to one word, in sentence case. Use 4–6 tones; more than that becomes a menu.
- Disable the group while generating so the tone can't change mid-request.
- The consumer supplies `options` and handles `onChange`. Added for the Microcopy lab; not in the Figma file.
